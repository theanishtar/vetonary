const mongoose = require('mongoose');
const User = require('./user.model');
const Badword = require('./badword.model');

const contributeSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId, // Đảm bảo sử dụng một giá trị mặc định
  },
  createDate: {
    type: Date,
    default: new Date()
  },
  author: {
    type: String
  },
  message: {
    type: String
  },
  word: {
    type: String
  },
  added: {
    type: Boolean,
    default: false
  },
  badword: {
    createDate: {
      type: Date,
      default: new Date()
    },
    name: {
      type: String,
      default: this.word
    },
    label: {
      type: Number,
      default: 1
    },
    severityLevel: {
      type: Number,
      default: 1
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
});


const Contribute = mongoose.model('contribute', contributeSchema);

module.exports = Contribute;