const Contribute = require("../models/contribute.model");
const Users = require("../models/user.model");

exports.getAll = async (req, res) => {
  const contributes = await Contribute.find();
  res.json(contributes)
};

exports.save = async (req, res) => {
  const { name, label, severityLevel } = req.body;

  const badword = {
    name: name,
    label: label || 1,
    severityLevel: severityLevel || 1,
    createDate: new Date()
  }
  const newContribute = new Contribute(badword);
  const saveContribute = newContribute.save();
  return res.status(200).json({
    badword: newContribute,
    status: 1,
    action: "Successfully",
    message: "Word is saved to database temp"
  });
}
