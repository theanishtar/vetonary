const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Users = require("../models/user.model");

verifyToken = async (req, res, next) => {
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
      console.log(decoded)
      req.username = decoded.username;
      req.roles = decoded.roles;
      next();
    });
};

isAdmin = (req, res, next) => {
  const tokenBearer = req.header('Authorization');
  let token = tokenBearer.substring(7);

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token,
    config.secret,
    (err, decoded) => {
      if (err) {
        return res.status(403).send({
          message: "Forbidden!",
        });
      }
      console.log(decoded)
      if (!decoded.roles.includes('ADMIN'))
        return res.status(403).send({
          message: "Forbidden!",
        });
      next();
    });
};

isModerator = (req, res, next) => {
  const tokenBearer = req.header('Authorization');
  let token = tokenBearer.substring(7);

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token,
    config.secret,
    (err, decoded) => {
      if (err) {
        return res.status(403).send({
          message: "Forbidden!",
        });
      }
      console.log(decoded)
      if (!decoded.roles.includes('MODERATOR'))
        return res.status(403).send({
          message: "Forbidden!",
        });
      next();
    });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;
