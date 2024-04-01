const Badword = require("../models/badword.model");

const dataArr = [
  {
    name: 'dangdepzai',
    label: 1,
    severityLevel: 1,
    createDate: '2020-05-18T14:10:30Z'
  }
]
// Function to retrieve keys starting with a specific prefix
async function getKeysByPrefix(redis, prefix) {
  try {
    let cursor = '0';
    let data = [];
    do {
      const result = await redis.scan(cursor, 'MATCH', prefix + '*', 'COUNT', '1000');
      cursor = result[0];
      let keysWithPrefix = result[1];

      // Loại bỏ prefix từ các keys và thêm chúng vào mảng keys
      let keysWithoutPrefix = keysWithPrefix.map(key => key.replace(prefix, ''));
      const cache = {
        key: keysWithoutPrefix,
        // value: await redis.get(keysWithPrefix)
      }
      data = data.concat(keysWithoutPrefix);
    } while (cursor !== '0');

    return data;
  } catch (error) {
    console.error('Error retrieving keys by prefix:', error);
    return [];
  }
}

exports.addData = async (req, res, redis, prefix) => {
  dataArr.forEach(e => {
    let bdw = { name: e.name, label: e.label, severityLevel: e.severityLevel, createDate: e.createDate }
    redis.set(prefix + e.name, JSON.stringify(bdw))
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

exports.getCachesPater = async (req, res, redis, prefix) => {
  try {
    const pref = req.query.pref || prefix;
    getKeysByPrefix(redis, pref)
      .then(keys => {
        // console.log(keys)
        // console.log('Keys starting with prefix', prefix + ':', keys.length);
        return res.json({
          prefix: pref,
          data: keys
        })
      })
      .catch(error => {
        console.error('Error:', error);
      });

  } catch (error) {

  }
}

exports.getAllCache = async (req, res, redis, prefix) => {
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
      console.log(result[1]);
      // data.push({ key: key, value: JSON.parse(unescapedValue) });
      data.push({ key: key, value: JSON.parse(value) });


    });

    return res.json(data)

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error" });
  }
};

exports.postCache = async (req, res, redis, prefix) => {

  /*
  const data = {
    name: "bw:::QWERTY",
    label: 1,
    severityLevel: 1,
    createDate: 2020-05-18T14:10:30Z
  }
  */
  try {
    // Giá trị mới cần thiết lập cho key
    const badWord = {
      name: prefix + req.body.name,
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


exports.deleteCaches = async (req, res, redis, prefix) => {
  const key = prefix + req.query.key;
  try {
    // Xóa tất cả từ Redis
    // Flush all caches
    // Get number of keys before flush
    let keysBeforeFlush;

    redis.dbsize()
      .then(count => {
        keysBeforeFlush = count;
        console.log('Number of keys before flush:', keysBeforeFlush);
        // Flush all caches
        // return res.json({ action: `del cache with key is ${key}`, status: "Sucess", data: result });
        return redis.flushall();
      })
      .then(() => {
        console.log('All caches have been deleted successfully.');
        // Get number of keys after flush
        return redis.dbsize();
      })
      .then(keysAfterFlush => {
        const keysDeleted = keysBeforeFlush - keysAfterFlush;
        console.log('Number of caches deleted:', keysDeleted);
        return res.json({ action: `del caches`, status: "Sucess", data: keysDeleted });
      })
      .catch((err) => {
        console.error('Error:', err);
        return res.json({ action: `del caches`, status: "Faild", data: 0 });
      })
      .finally(() => {
        // Close the Redis connection
        // redis.quit();
      });
  } catch (error) {
    res.json(err)
  }
}


exports.deleteByKey = async (req, res, redis, prefix) => {
  const key = prefix + req.query.key;
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

exports.updateByKey = async (req, res, redis, prefix) => {
  const key = prefix + req.query.key;

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
      name: req.body.name || key,
      label: req.body.label || findCache.label,
      severityLevel: req.body.severityLevel || findCache.label,
      createDate: req.body.createDate || findCache.createDate
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

exports.getCacheByKey = async (req, res, redis, prefix) => {
  const key = prefix + req.query.key;
  console.log(key)
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

exports.addAllMongoToRedis = async (req, res, redis, prefix) => {
  const badwords = await Badword.find();
  let len = 0;
  badwords.forEach(e => {
    len++;
    const bw = JSON.stringify(e);
    redis.set(prefix + e.name, bw)
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

exports.missingRedis = async (req, res, redis, prefix) => {
  const badwords = await Badword.find();
  const keys = await redis.keys('*'); // Lấy tất cả các key trong Redis
  let data = [];

  // Sử dụng Promise.all để xử lý bất đồng bộ
  badwords.forEach(e => {
    if (keys.indexOf(e.name) < 0)
      data.push(e);
  })

  return res.status(200).json({ data: data, message: `${data.length} objects from Mongo are currently not present in Redis` });
}

exports.missingMongo = async (req, res, redis, prefix) => {
  let data = [];
  const keys = await redis.keys('*'); // Lấy tất cả các key trong Redis
  const badwords = await Badword.find().select('name');
  const names = badwords.map(badword => badword.name);

  for (let key of keys) {
    if (names.indexOf(key) < 0) {
      const cache = await redis.get(key);
      data.push(JSON.parse(cache));
    }
  }

  return res.status(200).json({ data: data, message: `${data.length} objects from Mongo are currently not present in Redis` });
}


exports.getTop100 = async (req, res, redis, prefix) => {

  let data = [];
  const keys = await redis.keys('*'); // Lấy tất cả các key trong Redis
  const pipeline = redis.pipeline(); // Tạo một pipeline để thực hiện các lệnh redis một cách tuần tự

  // Thêm các lệnh hỏi Redis để lấy dữ liệu tương ứng với từng key vào pipeline
  keys.forEach((key) => {
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

  data.sort((a, b) => b.value.severityLevel - a.value.severityLevel);

  // Lấy 100 dòng đầu tiên của 'data'
  const first100Lines = data.slice(0, 100);
  if (data.length > 0)
    return res.status(200).json({
      data: first100Lines,
      message: `APIs are developed for reference purposes, therefore only ${first100Lines.length} lines of data are available. Please contact github.com/Theanishtar to obtain the entire dataset.`,
      src: `Cahes`,
      sponsor: {
        sub: `To upgrade your account, please support the developer according to the following information!`,
        bank_name: `Viettinbank`,
        acc_number: `104878145669`,
        user_name: `TRAN HUU DANG`
      }
    });

  const badwords = await Badword.find();
  const bwfirst100Lines = badwords.slice(0, 100);
  return res.status(200).json({
    data: bwfirst100Lines,
    message: `APIs are developed for reference purposes, therefore only ${bwfirst100Lines.length} lines of data are available. Please contact github.com/Theanishtar to obtain the entire dataset.`,
    src: `Database`,
    sponsor: {
      sub: `To upgrade your account, please support the developer according to the following information!`,
      bank_name: `Viettinbank`,
      acc_number: `104878145669`,
      user_name: `TRAN HUU DANG`
    }
  });

}