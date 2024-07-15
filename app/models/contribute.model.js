const mongoose = require('mongoose');
const User = require('./user.model');
const Badword = require('./badword.model');

const contributeSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId, // Đảm bảo sử dụng một giá trị mặc định
  },
  createDate: {
    type: Date
  },
  label: {
    type: Number
  },
  name: {
    type: String
  },
  severityLevel: {
    type: Number
  },
  contributor: {
    type: Object,
  },
  // badword: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Badword'
  // },
});


const Contribute = mongoose.model('contribute', contributeSchema);

module.exports = Contribute;