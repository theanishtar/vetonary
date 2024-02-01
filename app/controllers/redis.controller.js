/*

// Lấy tất cả các key từ Redis
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
*/

exports.findKey = async (req, res, redis) => {
  // Tạo một Stream sử dụng scanStream()
  const stream = redis.scanStream();
  console.log(stream)
  // Xử lý sự kiện 'data' để nhận kết quả từ Redis
  stream.on('data', function (resultKeys) {
    // resultKeys là một mảng chứa các key
    resultKeys.forEach(function (key) {
      console.log('Key:', key);
    });
  });

  // Xử lý sự kiện 'end' để thông báo khi việc duyệt qua tất cả các key đã hoàn thành
  stream.on('end', function () {
    console.log('Scan completed');

    // Đóng kết nối sau khi hoàn thành
    redis.quit();
  });

  res.json(3)
};

exports.getAllCache = async (req, res, redis) => {
  try {
    redis.keys("*", function (err, keys) {
      if (err) {
        console.error("Error retrieving keys:", err);
        return { err: err };
      }

      // Lặp qua từng key và lấy giá trị của nó
      keys.forEach(function (key) {
        redis.get(key, function (err, value) {
          if (err) {
            console.error("Error retrieving value for key", key, ":", err);
            return { err: err };
          }
          console.log("Key:", key, "Value:", value);
        });
      });
    });
    res.json("badwords");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error" });
  }
};