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
        res.json({ err: err });
        return;
      }

      // Sử dụng Promise.all để đợi cho tất cả các lời gọi redis.get hoàn thành
      let promises = keys.map(function (key) {
        return new Promise(function (resolve, reject) {
          redis.get(key, function (err, value) {
            if (err) {
              console.error("Error retrieving value for key", key, ":", err);
              reject(err);
            } else {
              console.log("Key:", key, "Value:", value);
              data.push({ key: key, val: (value) });
              resolve();
            }
          });
        });
      });

      // Sau khi tất cả các promises đã được giải quyết, gọi res.json
      Promise.all(promises)
        .then(function () {
          res.json(data);
        })
        .catch(function (err) {
          res.json({ err: err });
        });
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error" });
  }
};

exports.deleteByKey = async (req, res, redis) => {
  const key = req.query.key;

  try {
    // Xóa một key từ Redis
    redis.del(key).then((result) => {
      console.log('Deleted Successfully!', result);
      if (result > 0)
        return res.json({ action: `del cache with key is ${key}`, status: "Sucess", data: result });
      return res.status(404).json({ action: `del cache with key is ${key}`, status: "Not found", data: result });

    }).catch((err) => {
      console.error('Error:', err);
      res.json(err)
    }).finally(() => {
    });
  } catch (error) {
    res.json(err)
  }

}

exports.updateByKey = async (req, res, redis) => {
  const key = req.query.key;

  /*
  const data = {
    name: "QWERTY",
    label: 1,
    severityLevel: 1,
    createDate: 2020-05-18T14:10:30Z
  }
  */
  try {
    // Giá trị mới cần thiết lập cho key
    const badWord = {
      name: req.body.name,
      label: req.body.label,
      severityLevel: req.body.severityLevel,
      createDate: req.body.createDate
    }
    console.log(badWord)

    // Cập nhật giá trị của key trong Redis
    redis.set(key, badWord).then((result) => {
      console.log('Updated Successfully!', result);
      if (result === 'OK') {
        // Trả về phản hồi nếu cập nhật thành công
        return res.json({ action: `update cache with key ${key}`, status: "Success", data: result });
      } else {
        // Trả về lỗi nếu không thể cập nhật key
        return res.status(500).json({ action: `update cache with key ${key}`, status: "Error", data: result });
      }
    }).catch((err) => {
      console.error('Error:', err);
      // Trả về lỗi nếu có lỗi xảy ra trong quá trình cập nhật
      res.status(500).json(err);
    }).finally(() => {
      // Đóng kết nối Redis
    });
  } catch (error) {
    res.json(err)
  }

}

exports.getCacheByKey = async (req, res, redis) => {
  const key = req.query.key;
  try {
    // Kiểm tra xem dữ liệu có trong cache không
    const findCache = await redis.get(key);
    if (findCache)
      return res.status(200).json({ data: JSON.parse(findCache) });

    console.log("Khong co trong cache")

    return res.status(404).json({ data: "", message: "Word not found" });
  } catch (error) {
    return res.status(500).json({ error: "Error" });
  }
};