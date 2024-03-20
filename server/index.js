const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const bodyParser = require('body-parser');
const http = require('http'); // Import module http
const Redis = require("ioredis");
const db = require("./app/models");
const { mongoose } = require("./app/models");
const config = require('./app/config/index');

//---------- CONFIG SERVER  ---------------------
const redisURI = config.dbConfig.REDIS_URI;
const mongodbURI = config.dbConfig.MONGO_URI;
const prefix = config.dbConfig.PREFIX_CACHE;
// set port, listen for requests
const PORT = config.serverConfig.PORT || 5152;
/*----------------------------------------------*/

const app = express();
const server = http.createServer(app); // Tạo server từ express app

dotent.config();
app.use(cors());
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "davis-app-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true
  })
);

/**--------------------- DB CONNECTIONS -------------------------*/

const redis = new Redis(redisURI); // Khởi tạo một đối tượng Redis
// Kiểm tra trạng thái kết nối
redis.on("connect", function () {
  console.log("Connected to Redis successfully!");
});
// Xử lý lỗi kết nối
redis.on("error", function (error) {
  console.error("Redis connection error:", error);
});

db.mongoose
  .connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB." + mongodbURI);
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

/*-------------------------- ROUTES ------------------- */
app.get('/', (req, res) => {
  res.json({
    live: "Hello server is live",
    connection: connectionStatus
  });
});
require("./app/routes/badword.route")(app, redis);
require("./app/routes/cache.route")(app, redis, prefix);
require("./app/routes/auth.route")(app);
require("./app/routes/db.route")(app);
require("./app/routes/contribute.route")(app);


//Thay vì sử dụng app.listen, sử dụng server.listen để sử dụng cùng một cổng cho cả express app và Socket.IO:
server.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}.`);
});
