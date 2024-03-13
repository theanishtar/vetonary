const mongoose = require('mongoose');

const badwordSchema = new mongoose.Schema({
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
  deleted: {
    type: Boolean
  }
});


const Badword = mongoose.model('Badword', badwordSchema);

module.exports = Badword;