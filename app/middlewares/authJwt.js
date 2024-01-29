const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  const tokenBearer = req.header('Authorization');
  let token = tokenBearer.substring(7);

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token,
    config.secret,
    (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      req.email = decoded.email;
      next();
    });
};


const authJwt = {
  verifyToken,
};
module.exports = authJwt;
