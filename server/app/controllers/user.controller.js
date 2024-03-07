const Badword = require("../models/badword.model");
const Users = require("../models/user.model");

exports.getAll = async (req, res, redis) => {
  const user = await Users.find({ token: req.token });
  console.log(`token: ${req.token} => User: ${user}`);
};

exports.addUser = async (req, res, redis) => {
  const user = {
    createDate: new Date(),
    username: "dangth",
    fullname: "Trần Hữu Đang",
    password: "123",
    role: ['MODERATOR', 'ADMIN'],
    token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9676x56fheiu"
  }

  const newUser = new Users(user);
  const saveUser = newUser.save();

  console.log(saveUser)
};
