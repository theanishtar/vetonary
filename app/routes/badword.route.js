
const controller = require("../controllers/badword.controller");

module.exports = function (app, io) {
  app.use(function (req, res, next) {

    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/api/badwords', controller.getAllBadwords);
};
