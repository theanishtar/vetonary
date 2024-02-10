const Badword = require("../models/badword.model");

exports.getAllBadwords = async (req, res, redis) => {
  try {

    redis.keys("*", function (err, keys) {
      if (err) {
        console.error("Error retrieving keys:", err);
        return;
      }

      // Lặp qua từng key và lấy giá trị của nó
      keys.forEach(function (key) {
        redis.get(key, function (err, value) {
          if (err) {
            console.error("Error retrieving value for key", key, ":", err);
            return;
          }
          console.log("Key:", key, "Value:", value);
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
  const name = req.query.name;
  try {
    // Kiểm tra xem dữ liệu có trong cache không
    const findCache = await redis.get(name);
    if (findCache)
      return res.status(200).json({ data: JSON.parse(findCache), message: "This is VN badword" });

    console.log("Khong co trong cache")
    const badwords = await Badword.find({ name });
    console.log(badwords.length)
    if (badwords.length == 0)
      return res.status(404).json({ data: "", message: "Word not found" });

    return res.status(200).json({ data: badwords, message: "This is VN badword" });
  } catch (error) {
    return res.status(500).json({ error: "Error" });
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
      badwords.push(findCache);
      return res.status(200).json(
        {
          badwords: badwords,
          label: resCache.label,
          cleanWord: replaceWordWithAsterisks(line, resCache.name),
          message: "This is VN badword"
        });
    }

    const word = line.split(" ");
    const cache = word.map(async (name) => {
      const bad = await redis.get(name);
      return { name, bad };
    });
    const results = await Promise.all(cache);

    results.forEach(e => {
      if (e.bad != null) {
        hasBadword = JSON.parse(e.bad);
      }
    });
    if (hasBadword) {
      badwords.push(hasBadword);
      return res.status(200).json(
        {
          badwords: badwords,
          label: hasBadword.label,
          cleanWord: replaceWordWithAsterisks(line, hasBadword.name),
          message: "This is VN badword"
        });
    }
    const name = line;
    const badw = await Badword.find({ name });
    console.log(badw.length > 0 && badw)
    if (badw && badw.length > 0) {
      badwords.push(badw);
      return res.status(200).json(
        {
          badwords: badwords,
          label: badw.label,
          cleanWord: replaceWordWithAsterisks(line, badw.name),
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
          badwords: badwords,
          label: hasBadword.label,
          cleanWord: replaceWordWithAsterisks(line, hasBadword.name),
          message: "This is VN badword"
        });
    }
    return res.status(404).json({ data: "", label: 0, message: "Word not found" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "ERR" });
  }
};

function replaceWordWithAsterisks(s, key) {
  let new_s = '';
  let words = s.split(' '); // Tách chuỗi thành các từ

  // Duyệt qua từng từ trong chuỗi
  for (let i = 0; i < words.length; i++) {
    // Nếu từ trùng khớp với key thì thay thế bằng dấu sao
    if (words[i] === key) {
      // Thay thế từ với dấu sao có độ dài bằng với từ khóa
      new_s += '*'.repeat(key.length);
    } else {
      new_s += words[i]; // Giữ nguyên từ không cần thay thế
    }
    if (i < words.length - 1) {
      new_s += ' '; // Thêm khoảng trắng nếu không phải từ cuối cùng
    }
  }

  return new_s;
}

// let s = "hell my friends";
// let key = "hell";

// let new_s = replaceWordWithAsterisks(s, key);
// console.log(new_s); // Kết quả: "****o my friends"
