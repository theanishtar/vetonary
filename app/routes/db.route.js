const controller = require("../controllers/badword.controller");
const auth = require("../middlewares/authJwt");

module.exports = function (app) {
  app.use(function (req, res, next) {

    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  //CRUD
  app.get('/api/dbs', auth.isAdmin, (req, res) => controller.getAllDB(req, res)); //api/db?name=cút
  app.get('/api/db', auth.isModerator, (req, res) => controller.getDB(req, res)); //api/db?name=cút
  app.post('/api/db', auth.isModerator, (req, res) => controller.postDB(req, res)); //api/db
  app.put('/api/db', auth.isModerator, (req, res) => controller.updateDB(req, res)); //api/db
  app.delete('/api/db', auth.isModerator, (req, res) => controller.deleteDB(req, res)); //api/db?name=cút
  ///app.delete('/api/db', auth.verifyToken, (req, res) => cache.deleteByKey(req, res, redis)); //api/db?name=cút

};
