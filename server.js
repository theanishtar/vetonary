const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const bodyParser = require('body-parser');
const http = require('http'); // Import module http
const dbConfig = require("./app/config/db.config");
const fileparser = require('./app/utils/fileparser');

const app = express();

const server = http.createServer(app); // Tạo server từ express app

const db = require("./app/models");
const { mongoose } = require("./app/models");
var dotent = require('dotenv');
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


db.mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB." + process.env.MONGODB_URI);
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });



// routes
require("./app/routes/badword.route")(app);


// set port, listen for requests
const PORT = process.env.PORT || 5152;
server.listen(PORT, () => {  //Thay vì sử dụng app.listen, hãy sử dụng server.listen để sử dụng cùng một cổng cho cả express app và Socket.IO:
  console.log(`Server is running on port ${PORT}.`);
});