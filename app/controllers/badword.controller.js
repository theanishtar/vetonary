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
      return res.status(200).json({ data: findCache, message: "This is VN badword" });

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
  console.log(line)
  try {
    // Kiểm tra xem dữ liệu có trong cache không
    const findCache = await redis.get(line);
    if (findCache)
      return res.status(200).json({ data: JSON.parse(findCache), message: "This is VN badword" });

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
    if (hasBadword)
      return res.status(200).json({ data: hasBadword, message: "This is VN badword" });

    const name = line;
    const badw = await Badword.find({ name });
    console.log(badw.length > 0 && badw)
    if (badw && badw.length > 0)
      return res.status(200).json({ data: badw, message: "This is VN badword1" });
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
      return res.status(200).json({ data: hasBadword, message: "This is VN badword" });
    }
    return res.status(404).json({ data: "", message: "Word not found" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "ERR" });
  }
};