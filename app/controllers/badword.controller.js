const Badword = require("../models/badword.model");

// Hàm để lấy dữ liệu từ cache hoặc từ cơ sở dữ liệu nếu không có trong cache
const getBadwordsFromCache = async (redis, name) => {
  try {
    // Kiểm tra xem dữ liệu có trong cache không
    const cachedBadwords = await redis.get(name);
    console.log(`Data: ${cachedBadwords}`)
    return JSON.parse(cachedBadwords);
    if (cachedBadwords) {
      // Nếu có, chuyển đổi dữ liệu từ chuỗi JSON sang đối tượng JavaScript và trả về
      return JSON.parse(cachedBadwords);
    } else {
      // Nếu không có trong cache, truy vấn cơ sở dữ liệu MongoDB
      const badwordsFromDB = await Badword.find({});
      // Lưu dữ liệu vào cache với thời gian sống là 1 giờ
      await redis.set('badwords', JSON.stringify(badwordsFromDB), 'EX', 3600);
      return badwordsFromDB;
    }
  } catch (error) {
    console.error('Error retrieving badwords:', error);
    throw error;
  }
};

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
    console.log("Func: " + findCache)
    if (findCache)
      return res.json(JSON.parse(findCache))

    console.log("Khong co trong cache")
    const badwords = await Badword.find({ name });
    return res.json(badwords);
  } catch (error) {
    return res.status(500).json({ error: "Error" });
  }
};