var dotent = require('dotenv');

const redisURI = process.env.REDIS_URI;
const mongodbURI = process.env.MONGODB_URI;
const prefix = process.env.PREFIX;

module.exports = {
  MONGO_URI: mongodbURI,
  REDIS_URI: redisURI,
  PREFIX_CACHE: prefix
};