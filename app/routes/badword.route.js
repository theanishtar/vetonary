const cache = require("../controllers/redis.controller");
const controller = require("../controllers/badword.controller");
const auth = require("../middlewares/authMongo");

module.exports = function (app, redis) {
  app.use(function (req, res, next) {

    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/api/badwords', auth.verifyToken, (req, res) => controller.getAllBadwords(req, res, redis));
  app.get('/api/badword', (req, res) => controller.getBadwordByName(req, res, redis)); //api/badword?name=cút
  app.post('/api/badword', (req, res) => controller.checkBadword(req, res, redis));
  app.post('/api/cleanwords', (req, res) => controller.cleanWords(req, res, redis));
  app.get('/api/cleanword', (req, res) => controller.getCleanWords(req, res, redis)); //api/cleanword?word=cút
};
