const Badword = require("../models/badword.model");

exports.getAllBadwords = async (req, res, redis) => {
  try {
    const badwords = await Badword.find();
    res.json(badwords);
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
};

exports.getBadwordByName = async (req, res, redis) => {
  const name = req.query.name;
  try {
    // Kiểm tra xem dữ liệu có trong cache không
    const findCache = await redis.get(name);
    if (findCache)
      return res.json(JSON.parse(findCache))

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
  try {
    // Kiểm tra xem dữ liệu có trong cache không
    const findCache = await redis.get(line);
    if (findCache)
      return res.json(JSON.parse(findCache))

    const word = line.split(" ");
    const promises = word.map(async (name) => {
      const bad = await redis.get(name);
      return { name, bad };
    });
    const results = await Promise.all(promises);
    let hasBadword; // Cờ để kiểm tra xem có badword không

    results.forEach(e => {
      if (e.bad != null) {
        hasBadword = JSON.parse(e.bad);
      }
    });

    // Nếu không có badword nào trong results, trả về phản hồi 'Word not found'
    if (!hasBadword) {
      res.status(404).json({ data: "", message: "Word not found" });
    }
    return res.status(404).json({ data: hasBadword, message: "Word not found" });
  } catch (error) {
    return res.status(500).json({ error: "Error" });
  }
};