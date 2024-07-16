const Contribute = require("../models/contribute.model");
const Users = require("../models/user.model");
const Badword = require("../models/badword.model");

exports.getAll = async (req, res) => {
  const contributes = await Contribute.find();
  res.json(contributes)
};

exports.save = async (req, res) => {
  const { name, label, severityLevel, contributor } = req.body;
  const { fullname, mess } = contributor;

  const contribute = {
    name: name || "nonameyet",
    label: label || 1,
    severityLevel: severityLevel || 1,
    createDate: new Date(),
    contributor: {
      fullname: "Trần Hữu Đang",
      mess: "Lời nhắn 1"
    }
  };

  const newContribute = new Contribute(contribute);
  const saveContribute = newContribute.save();
  return res.status(200).json({
    badword: newContribute,
    status: 1,
    action: "Successfully",
    message: "Word is saved to database temp"
  });
}

exports.contributeBadword = async (req, res) => {
  const { author, message, badword, word } = req.body;
  // const { label, severityLevel, name } = req.body.badword;

  const contribute = {
    author: author || "nonameyet",
    message: message || "nobioyet",
    word: word,
    badword: {
      name: word
    }
  };

  const exits = await Contribute.find({ word: word });

  if (exits.length > 0) {
    return res.status(200).json({
      badword: contribute.badword,
      status: 0,
      action: "Failed",
      message: "Word is exits from database temp"
    });
  }

  const newContribute = new Contribute(contribute);
  const saveContribute = newContribute.save();
  return res.status(200).json({
    badword: contribute.badword,
    status: 1,
    action: "Successfully",
    message: "Word is saved to database temp"
  });
}


exports.addContributeToDB = async (req, res) => {
  try {
    const user = await Users.find({ token: req.query.tk, username: req.query.un });

    if (user.length === 0) {
      return res.status(200).json({
        author: user,
        status: 0,
        action: "Failed",
        message: "Username or token unvaliable"
      })
    }

    const badwordContribute = await Contribute.find();
    let saveToDB = [];
    let existingBadwords = [];

    for (let obj of badwordContribute) {

      if (!obj.added) {
        const badwordSame = await Badword.find({ name: obj.badword.name });

        if (badwordSame.length === 0) {
          //Lưu vào conllection badwords
          const newBadword = new Badword(obj.badword);
          const saveBadword = newBadword.save();
          saveToDB.push(obj.badword.name);

          // cập nhật trạng thái đã thêm
          await Contribute.findByIdAndUpdate(obj._id, { added: true });
        } else {
          existingBadwords.push(obj.badword.name);
        }
      }
    }

    return res.status(200).json({
      author: user.fullname,
      newBadword: saveToDB.length,
      existing: existingBadwords.length,
      details: {
        saveToDB: saveToDB,
        existingBadwords: existingBadwords
      }
    });
  } catch (error) {
    return res.status(400).json(error);
  }
}

