const Badword = require("../models/badword.model");

const dataArr = [
  {
    name: 'dangdepzai',
    label: 1,
    severityLevel: 1,
    createDate: '2020-05-18T14:10:30Z'
  }
]
exports.addData = async (req, res, redis) => {
  dataArr.forEach(e => {
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

    return res.json(data)

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error" });
  }
};

exports.postCache = async (req, res, redis) => {

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
      label: req.body.label || 1,
      severityLevel: req.body.severityLevel || 1,
      createDate: new Date()
    }
    const key = badWord.name;
    console.log(badWord)
    // Kiểm tra xem dữ liệu có trong cache không
    const findCache = await redis.get(key);
    if (findCache)
      return res.status(203).json({ data: "", message: "Word repeating" });

    // Thêm giá trị của key trong Redis
    redis.set(key, JSON.stringify(badWord)).then((result) => {
      console.log('POST Successfully!', result);
      if (result === 'OK') {
        // Trả về phản hồi nếu thêm thành công
        return res.json({ action: `Post cache with key ${key}`, status: "Success", data: result });
      } else {
        // Trả về lỗi nếu không thể cập nhật key
        return res.status(500).json({ action: `post cache with key ${key}`, status: "Error", data: badWord });
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
    // Kiểm tra xem dữ liệu có trong cache không
    const findCache = await redis.get(key);
    if (!findCache)
      return res.status(404).json({ data: "", message: "Word not found" });

    // Giá trị mới cần thiết lập cho key
    const badWord = {
      name: req.body.name,
      label: req.body.label,
      severityLevel: req.body.severityLevel,
      createDate: req.body.createDate
    }
    console.log(badWord)

    // Cập nhật giá trị của key trong Redis
    redis.set(key, JSON.stringify(badWord)).then((result) => {
      console.log('Updated Successfully!', result);
      if (result === 'OK') {
        // Trả về phản hồi nếu cập nhật thành công
        return res.json({ action: `update cache with key ${key}`, status: "Success", data: result });
      } else {
        // Trả về lỗi nếu không thể cập nhật key
        return res.status(500).json({ action: `update cache with key ${key}`, status: "Error", data: badWord });
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
    console.log(findCache)
    if (findCache)
      return res.status(200).json({ data: JSON.parse(findCache) });

    console.log("Khong co trong cache")

    return res.status(404).json({ data: "", message: "Word not found" });
  } catch (error) {
    return res.status(500).json({ error: "Error" });
  }
};

exports.addAllMongoToRedis = async (eq, res, redis) => {
  const badwords = await Badword.find();
  let len = 0;
  badwords.forEach(e => {
    len++;
    redis.set(e.name, JSON.stringify(e))
      .then(() => {
        console.log('Dữ liệu đã được thêm vào Redis thành công.', e);
      })
      .catch((error) => {
        console.error('Đã xảy ra lỗi khi thêm dữ liệu vào Redis:', error);
        return res.status(200).json(
          { action: "Add Mongo to Redis", status: "Failed", message: `Failed when add ${badwords.length} to Cache memory`, success: `${len} Objects` });
      })
      .finally(() => {
      });
  })
  return res.status(200).json({ action: "Add Mongo to Redis", status: "success", message: `Add ${badwords.length} to Cache memory`, success: `${len} Objects` });
};

exports.missingRedis = async (req, res, redis) => {
  const badwords = await Badword.find();
  let data = [];
  let len = 0;

  // Sử dụng Promise.all để xử lý bất đồng bộ
  await Promise.all(badwords.map(async (e) => {
    const findCache = await redis.get(e.name);
    if (!findCache)
      data.push(e);
  }));

  // Tiếp tục xử lý dữ liệu sau khi đã lấy được dữ liệu từ Redis
  console.log(data);
  return res.status(200).json({ data: data, message: `${data.length} objects from Mongo are currently not present in Redis` });
}

exports.missingMongo = async (req, res, redis) => {
  let data = [];
  const keys = await redis.keys('*'); // Lấy tất cả các key trong Redis
  const pipeline = redis.pipeline(); // Tạo một pipeline để thực hiện các lệnh redis một cách tuần tự

  // Thêm các lệnh hỏi Redis để lấy dữ liệu tương ứng với từng key vào pipeline
  keys.forEach(key => {
    pipeline.get(key);
  });

  // Thực hiện pipeline để lấy dữ liệu từ Redis
  const caches = await pipeline.exec();

  for (let result of caches) {
    const value = JSON.parse(result[1]); // result[1] chứa giá trị được trả về từ Redis
    // console.log(`value: ${value}`);
    const badword = await Badword.find({ name: value.name });

    if (badword.length === 0) {
      data.push(value)
    }
  }
  return res.status(200).json({ data: data, message: `${data.length} objects from Mongo are currently not present in Redis` });
}