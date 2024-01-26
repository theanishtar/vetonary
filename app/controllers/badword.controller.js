const Badword = require("../models/badword.model");


exports.getAllBadwords = async (req, res) => {
  try {
    const badwords = await Badword.find();

    console.log("get" + badwords);
    res.json(badwords);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error" });
  }
};