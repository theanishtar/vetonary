const controller = require("../controllers/contribute.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/contributes", controller.getAll);
  app.post("/api/contribute", controller.save);
  app.post("/api/contribute/badword", controller.contributeBadword);
  app.get("/api/contribute/push", controller.addContributeToDB); //un=dangth&tk=
};
