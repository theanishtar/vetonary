const Badword = require("../models/badword.model");

exports.getAllBadwords = async (req, res, redis) => {
  try {
    redis.keys("*", function (err, keys) {
      if (err) {
        console.error("Error retrieving keys: ", err);
        return;
      }

      // Lặp qua từng key và lấy giá trị của nó
      keys.forEach(function (key) {
        redis.get(key, function (err, value) {
          if (err) {
            console.error("Error retrieving value for key", key, ":", err);
            return;
          }
          // console.log("Key:", key, "Value:", value);
        });
      });
    });


    const badwords = await Badword.find();
    res.json(badwords);
  } catch (error) {
    res.status(500).json({ error: "Error: " + error });
  }
};

exports.getBadwordByName = async (req, res, redis) => {
  try {
    const name = req.query.name;
    // Kiểm tra xem dữ liệu có trong cache không
    const findCache = await redis.get(name);
    if (findCache)
      return res.status(200).json({ data: JSON.parse(findCache), message: "This is VN badword" });

    let data = [];
    const keys = await redis.keys('*'); // Lấy tất cả các key trong Redis
    const pipeline = redis.pipeline(); // Tạo một pipeline để thực hiện các lệnh redis một cách tuần tự

    // Thêm các lệnh hỏi Redis để lấy dữ liệu tương ứng với từng key vào pipeline
    keys.forEach(key => {
      pipeline.get(key);
    });

    // Thực hiện pipeline để lấy dữ liệu từ Redis
    const results = await pipeline.exec();

    // Tạo một đối tượng chứa dữ liệu từ Redis
    results.forEach((result, index) => {
      const key = keys[index];
      const value = result[1]; // result[1] chứa giá trị được trả về từ Redis
      data.push({ key: key, value: JSON.parse(value) });
    });
    data.forEach(e => {
      if (name.includes(e.key)) {
        checkContains = e.value;
        return;
      }
    })
    if (checkContains)
      return res.status(200).json({ data: checkContains, message: "This is VN badword" });

    const badwords = await Badword.find({ name });
    console.log(badwords.length)
    if (badwords.length == 0)
      return res.status(404).json({ data: "", message: "Word not found" });

    return res.status(200).json({ data: badwords, message: "This is VN badword" });
  } catch (error) {
    return res.status(500).json({ error: `Error ${error}` });
  }
};

/*
  body: {
    words: "text"
  }
*/
exports.checkBadword = async (req, res, redis) => {
  const line = req.body.words;
  let hasBadword; // Cờ để kiểm tra xem có badword không
  console.log(line);
  let badwords = [];
  try {
    // Kiểm tra xem dữ liệu có trong cache không
    const findCache = await redis.get(line);
    const resCache = JSON.parse(findCache);
    if (findCache) {
      badwords.push(resCache);
      return res.status(200).json(
        {
          badWords: badwords,
          label: resCache.label,
          message: "This is VN badword"
        });
    }


    let data = [];
    const keys = await redis.keys('*'); // Lấy tất cả các key trong Redis
    const pipeline = redis.pipeline(); // Tạo một pipeline để thực hiện các lệnh redis một cách tuần tự

    // Thêm các lệnh hỏi Redis để lấy dữ liệu tương ứng với từng key vào pipeline
    keys.forEach(key => {
      pipeline.get(key);
    });

    // Thực hiện pipeline để lấy dữ liệu từ Redis
    const results = await pipeline.exec();

    // Tạo một đối tượng chứa dữ liệu từ Redis
    results.forEach((result, index) => {
      const key = keys[index];
      const value = result[1]; // result[1] chứa giá trị được trả về từ Redis
      data.push({ key: key, value: JSON.parse(value) });
    });
    data.forEach(e => {
      if (line.includes(e.key)) {
        checkContains = e.value;
        badwords.push(checkContains);
        return;
      }
    })
    if (checkContains)
      return res.status(200).json(
        {
          badWords: badwords,
          label: badwords.length,
          message: "This is VN badword"
        });
    const name = line;
    const badw = await Badword.find({ name });
    console.log(badw.length > 0 && badw)
    if (badw && badw.length > 0) {
      badwords.push(badw);
      return res.status(200).json(
        {
          badWords: badwords,
          label: badw.label,
          message: "This is VN badword"
        });
    }
    const db = word.map(async (nameW) => {
      const bad = await Badword.find({ name: nameW });
      return { nameW, bad };
    });
    const dbResults = await Promise.all(db);
    dbResults.forEach(e => {
      if (e.bad.length > 0) {
        hasBadword = e.bad;
        return;
      }
    });

    // Nếu không có badword nào trong results, trả về phản hồi 'Word not found'
    if (hasBadword) {
      badwords.push(hasBadword);
      return res.status(200).json(
        {
          badWords: badwords,
          label: hasBadword.label,
          message: "This is VN badword"
        });
    }
    return res.status(404).json({ badWords: badwords, label: 0, message: "Word not found" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "ERR" });
  }
};


exports.cleanWords = async (req, res, redis) => {
  const line = req.body.words || req.query.word;
  let hasBadword; // Cờ để kiểm tra xem có badword không
  let badwords = [];
  try {
    // Cả chuỗi đều là badwords
    const findCache = await redis.get(line);
    const resCache = JSON.parse(findCache);
    if (findCache) {
      badwords.push(resCache);
      let cleanWords = '*'.repeat(resCache.name.length);
      return res.status(200).json(
        {
          badWords: badwords,
          label: badwords.length,
          cleanWord: cleanWords,
          message: "This is VN badword"
        });
    }

    let data = [];
    const keys = await redis.keys('*'); // Lấy tất cả các key trong Redis
    const pipeline = redis.pipeline(); // Tạo một pipeline để thực hiện các lệnh redis một cách tuần tự

    // Thêm các lệnh hỏi Redis để lấy dữ liệu tương ứng với từng key vào pipeline
    keys.forEach(key => {
      pipeline.get(key);
    });

    // Thực hiện pipeline để lấy dữ liệu từ Redis
    const results = await pipeline.exec();

    // Tạo một đối tượng chứa dữ liệu từ Redis
    results.forEach((result, index) => {
      const key = keys[index];
      const value = result[1]; // result[1] chứa giá trị được trả về từ Redis
      data.push({ key: key, value: JSON.parse(value) });
    });
    data.forEach(e => {
      if (line.includes(e.key)) {
        checkContains = e.value;
        badwords.push(checkContains);
        return;
      }
    })
    if (checkContains) {
      cleanWords = cleanWordsInLine(line, badwords);
      return res.status(200).json(
        {
          badWords: badwords,
          label: badwords.length,
          cleanWord: cleanWords,
          message: "This is VN badword"
        });
    }
    const name = line;
    const badw = await Badword.find({ name });
    console.log(badw.length > 0 && badw)
    if (badw && badw.length > 0) {
      badwords.push(badw);
    }
    const db = word.map(async (nameW) => {
      const bad = await Badword.find({ name: nameW });
      return { nameW, bad };
    });
    const dbResults = await Promise.all(db);
    dbResults.forEach(e => {
      if (e.bad.length > 0) {
        hasBadword = e.bad;
        return;
      }
    });

    if (hasBadword) {
      badwords.push(hasBadword);
    }

    if (badwords.length > 0) {
      const cleanWords = this.cleanWords(line, badwords);
      return res.status(200).json(
        {
          badWords: badwords,
          label: badwords.length,
          cleanWord: cleanWords,
          message: "This is VN badword"
        });
    }

    return res.status(404).json({ badWords: badwords, label: 0, message: "Word not found" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "ERR" });
  }
};

exports.getCleanWords = async (req, res, redis) => {
  const line = req.query.word;
  let hasBadword; // Cờ để kiểm tra xem có badword không
  let badwords = [];
  try {
    // Cả chuỗi đều là badwords
    const findCache = await redis.get(line);
    const resCache = JSON.parse(findCache);
    if (findCache) {
      badwords.push(resCache);
      const cleanWords = '*'.repeat(resCache.name.length);
      return res.status(200).json(
        {
          badWords: badwords,
          label: badwords.length,
          cleanWord: cleanWords,
          message: "This is VN badword"
        });
    }

    // Tách từng chuỗi con
    const word = line.split(" ");
    const cache = word.map(async (name) => {
      const bad = await redis.get(name);
      return { name, bad };
    });
    const results = await Promise.all(cache);

    results.forEach(e => {
      if (e.bad != null) {
        hasBadword = JSON.parse(e.bad);
        badwords.push(hasBadword);
      }
    });
    if (badwords.length > 0) {
      const cleanWords = cleanWordsInLine(line, badwords);
      console.log(cleanWords)
      return res.status(200).json(
        {
          badWords: badwords,
          label: badwords.length,
          cleanWord: cleanWords,
          message: "This is VN badword"
        });
    }
    const name = line;
    const badw = await Badword.find({ name });
    console.log(badw.length > 0 && badw)
    if (badw && badw.length > 0) {
      badwords.push(badw);
    }
    const db = word.map(async (nameW) => {
      const bad = await Badword.find({ name: nameW });
      return { nameW, bad };
    });
    const dbResults = await Promise.all(db);
    dbResults.forEach(e => {
      if (e.bad.length > 0) {
        hasBadword = e.bad;
        return;
      }
    });

    if (hasBadword) {
      badwords.push(hasBadword);
    }

    if (badwords.length > 0) {
      const cleanWords = this.cleanWords(line, badwords);
      return res.status(200).json(
        {
          badWords: badwords,
          label: badwords.length,
          cleanWord: cleanWords,
          message: "This is VN badword"
        });
    }

    return res.status(404).json({ badWords: badwords, label: 0, message: "Word not found" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "ERR" });
  }
};


function cleanWordsInLine(s, badwords) {
  badwords.forEach((e, i) => {
    let find = s.indexOf(badwords[i].name);
    while (find >= 0) {
      let sFirts = s.substring(0, find);
      let beep = '*'.repeat(badwords[i].name.length)
      let sLast = s.substring(find + badwords[i].name.length);
      s = `${sFirts}${beep}${sLast} `;
      find = s.indexOf(badwords[i], find + beep.length);
    }
  });
  return s.trim();
}


exports.getAllBadwordFromDB = async (req, res) => {
  try {
    const badwords = await Badword.find();

    return res.status(200).json({
      badwords
    });
  } catch (error) {
    return res.status(500).json({ error: "Error" });
  }
};

//api/db?name=cút
exports.getBadwordFromDbByName = async (req, res) => {
  const name = req.query.name;
  try {
    const badwords = await Badword.find({ name });
    console.log(badwords.length)
    if (badwords.length == 0)
      return res.status(404).json({
        badWords: badwords,
        label: badwords.length,
        message: "Word not found"
      });

    if (badwords[0].deleted == true)
      return res.status(404).json({
        badWords: badwords,
        label: badwords.length,
        message: "Word not found"
      });

    return res.status(200).json({
      badwords: badwords,
      label: badwords.length,
      message: "This is VN badword"
    });
  } catch (error) {
    return res.status(500).json({ error: "Error" });
  }
};

exports.postBadwordToDB = async (req, res) => {
  const { name, label, severityLevel } = req.body;
  try {
    const badwords = await Badword.find({ name });
    if (badwords.length != 0)
      return res.status(201).json({
        badwords: badwords,
        status: 0,
        action: "Failed",
        message: "Word is same from database, please post new data"
      });
    if (badwords[0].deleted == true)
      return res.status(201).json({
        badwords: badwords,
        status: 0,
        action: "Failed",
        message: "The word has been deleted from the database. Would you like to restore it?"
      });

    const badword = {
      name: name,
      label: label || 1,
      severityLevel: severityLevel || 1,
      createDate: new Date()
    }
    const newBadword = new Badword(badword);
    const saveBadword = newBadword.save();
    return res.status(200).json({
      badword: newBadword,
      status: 1,
      action: "Successfully",
      message: "Word is saved to database"
    });
  } catch (error) {
    return res.status(500).json({ error: "Error" });
  }
};


exports.updateBadwordInDbByName = async (req, res) => {
  const { name, label, severityLevel } = req.body;
  try {
    const badwords = await Badword.find({ name });
    if (badwords.length == 0)
      return res.status(404).json({
        badwords: badwords,
        status: 0,
        action: "Failed",
        message: `Word with name = ${name} is not found`
      });
    console.log(badwords[0]._id);
    const badword = {
      name: name,
      label: label,
      severityLevel: severityLevel,
      createDate: badwords[0].createDate
    }
    const updatedBadword = await Badword.updateOne({ _id: badwords[0]._id }, { $set: badword });
    return res.status(200).json({
      badword: badword,
      status: 1 ? updatedBadword.acknowledged : 0,
      change: updatedBadword.modifiedCount,
      action: "Successfully",
      message: "Word is updated to database"
    });
  } catch (error) {
    return res.status(500).json({ error: "Error" });
  }
};


//api/db?name=cút
exports.deleteBadwordInDbByName = async (req, res) => {
  const name = req.query.name;
  try {
    const badwords = await Badword.find({ name });
    console.log(badwords.length)
    if (badwords.length == 0)
      return res.status(404).json({
        badWords: badwords,
        label: badwords.length,
        message: "Word not found"
      });

    if (badwords[0].deleted == true)
      return res.status(200).json({
        badwords: badwords[0],
        status: -1,
        change: 0,
        action: "Failed",
        message: "The word has been deleted from the database. Would you like to restore it?"
      });

    // const deleteBadword = await Badword.deleteOne({ _id: badwords[0]._id });
    const deleteBadword = await Badword.updateOne({ _id: badwords[0]._id }, { $set: { deleted: true } });
    badwords[0].deleted = true;
    return res.status(200).json({
      badwords: badwords[0],
      status: 1 ? deleteBadword.acknowledged : 0,
      change: deleteBadword.deletedCount,
      action: "Successfully",
      message: "Word is deleted to database"
    });
  } catch (error) {
    return res.status(500).json({ error: "Error" });
  }
};
//CRUD MONGODB
