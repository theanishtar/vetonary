const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Users = require("../models/users.model");

verifyToken = async (req, res, next) => {

  const tokenBearer = req.header('Authorization');
  if (!tokenBearer)
    return res.status(403).send({ message: "No token provided!" });

  let token = tokenBearer.substring(7);

  const user = await Users.findOne({ token: token });

  if (!user) {
    return res.status(401).send({
      message: "Unauthorized!",
    });
  }
  req.role = user.role;
  next();
};


const authMongo = {
  verifyToken,
};
module.exports = authMongo;
