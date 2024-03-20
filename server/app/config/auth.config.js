var dotent = require('dotenv');

const secretJwt = process.env.SECRET_JWT;

module.exports = {
  SECRET_JWT: secretJwt,
};
