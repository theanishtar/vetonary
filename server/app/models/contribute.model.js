const mongoose = require('mongoose');

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
  }
});


const Contribute = mongoose.model('contribute', contributeSchema);

module.exports = Contribute;