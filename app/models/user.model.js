const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  createDate: {
    type: Date
  },
  username: {
    type: String
  },
  fullname: {
    type: String
  },
  password: {
    type: String
  },
  role: {
    type: Array
  },
  token: {
    type: String
  }
});


const User = mongoose.model('users', userSchema);

module.exports = User;