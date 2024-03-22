const cache = require("../controllers/redis.controller");
const auth = require("../middlewares/authJwt");

module.exports = function (app, redis, prefix) {
  app.use(function (req, res, next) {

    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/api/cache/top', (req, res) => cache.getTop100(req, res, redis, prefix));
  app.get('/api/caches', auth.isModerator, (req, res) => cache.getAllCache(req, res, redis, prefix));
  app.get('/api/caches/pattern', (req, res) => cache.getCachesPater(req, res, redis, prefix));
  app.get('/api/cache/missingRedis', auth.isModerator, (req, res) => cache.missingRedis(req, res, redis, prefix));
  app.get('/api/cache/missingMongo', auth.isModerator, (req, res) => cache.missingMongo(req, res, redis, prefix));
  app.post('/api/caches', auth.isModerator, (req, res) => cache.addAllMongoToRedis(req, res, redis, prefix));
  app.get('/api/cache', (req, res) => cache.getCacheByKey(req, res, redis, prefix)); //api/cache?key=cút
  app.delete('/api/caches', auth.isModerator, (req, res) => cache.deleteCaches(req, res, redis, prefix)); //api/cache?key=cút
  app.delete('/api/cache', auth.isModerator, (req, res) => cache.deleteByKey(req, res, redis, prefix)); //api/cache?key=cút
  app.put('/api/cache', auth.isModerator, (req, res) => cache.updateByKey(req, res, redis, prefix)); //api/cache?key=cút
  app.post('/api/cache', auth.isModerator, (req, res) => cache.postCache(req, res, redis, prefix)); //api/cache
};
