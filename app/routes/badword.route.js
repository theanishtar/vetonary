const cache = require("../controllers/redis.controller");
const controller = require("../controllers/badword.controller");

module.exports = function (app, redis) {
  app.use(function (req, res, next) {

    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/api/badwords', (req, res) => controller.getAllBadwords(req, res, redis));
  app.get('/api/badword', (req, res) => controller.getBadwordByName(req, res, redis)); //api/badword?name=cút
  app.post('/api/checkBadword', (req, res) => controller.checkBadword(req, res, redis));
};
