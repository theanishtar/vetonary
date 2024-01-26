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
    res.json(badwords);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error" });
  }
};