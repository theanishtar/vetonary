exports.addData = async (req, res, redis) => {
  data.forEach(e => {
    let bdw = { name: e.name, label: e.label, severityLevel: e.severityLevel, createDate: e.createDate }
    redis.set(e.name, JSON.stringify(bdw))
      .then(() => {
        console.log('Dữ liệu đã được thêm vào Redis thành công.', bdw);
      })
      .catch((error) => {
        console.error('Đã xảy ra lỗi khi thêm dữ liệu vào Redis:', error);
      })
      .finally(() => {
        // Đóng kết nối Redis sau khi hoàn tất
        // redis.quit();
        // console.log("SUCCESS !!!")
      });
  })
};

exports.getAllCache = async (req, res, redis) => {
  try {
    let data = [];
    redis.keys("*", function (err, keys) {
      if (err) {
        console.error("Error retrieving keys:", err);
        return { err: err };
      }
      // return res.json(keys);
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
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error" });
  }
};