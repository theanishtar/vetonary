const cache = require("../controllers/redis.controller");
const auth = require("../middlewares/authJwt");

module.exports = function (app, redis) {
  app.use(function (req, res, next) {

    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/api/caches/top', (req, res) => cache.getTop100(req, res, redis));
  app.get('/api/caches', auth.isModerator, (req, res) => cache.getAllCache(req, res, redis));
  app.get('/api/missingRedis', auth.isModerator, (req, res) => cache.missingRedis(req, res, redis));
  app.get('/api/missingMongo', auth.isModerator, (req, res) => cache.missingMongo(req, res, redis));
  app.post('/api/caches', auth.isModerator, (req, res) => cache.addAllMongoToRedis(req, res, redis));
  app.get('/api/cache', (req, res) => cache.getCacheByKey(req, res, redis)); //api/cache?key=cút
  app.delete('/api/cache', auth.isModerator, (req, res) => cache.deleteByKey(req, res, redis)); //api/cache?key=cút
  app.put('/api/cache', auth.isModerator, (req, res) => cache.updateByKey(req, res, redis)); //api/cache?key=cút
  app.post('/api/cache', auth.isModerator, (req, res) => cache.postCache(req, res, redis)); //api/cache
};
