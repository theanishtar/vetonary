const Guest = require("../models/guest.model");

exports.getAll = async (req, res) => {
  const user = await Guest.find();
  console.log(`token: ${req.token} => User: ${user}`);
};

exports.push = async (req, res) => {
  const guest = {
    createDate: new Date(),
    fullname: "Trần Hữu Đang",
    badword: "test_badword",
    mail: "lời nhắn 1",
    email: "test@example.com"
  }

  const newGuest = new Guest(guest);
  const saveGuest = newGuest.save();

  console.log(saveGuest);

  res.json(saveGuest);
};
