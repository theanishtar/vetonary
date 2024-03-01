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
  app.get('/api/dbs', auth.isAdmin, (req, res) => controller.getAllBadwordFromDB(req, res)); //api/db?name=cút
  app.get('/api/db', auth.isModerator, (req, res) => controller.getBadwordFromDbByName(req, res)); //api/db?name=cút
  app.post('/api/db', auth.isModerator, (req, res) => controller.postBadwordToDB(req, res)); //api/db
  app.put('/api/db', auth.isModerator, (req, res) => controller.updateBadwordInDbByName(req, res)); //api/db
  app.delete('/api/db', auth.isModerator, (req, res) => controller.deleteBadwordInDbByName(req, res)); //api/db?name=cút

};
