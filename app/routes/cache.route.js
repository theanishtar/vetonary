const cache = require("../controllers/redis.controller");

module.exports = function (app, redis) {
  app.use(function (req, res, next) {

    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/api/caches', (req, res) => cache.getAllCache(req, res, redis));
  app.get('/api/cache', (req, res) => cache.getCacheByKey(req, res, redis));
  app.delete('/api/cache', (req, res) => cache.deleteByKey(req, res, redis));
  app.put('/api/cache', (req, res) => cache.updateByKey(req, res, redis));
};
