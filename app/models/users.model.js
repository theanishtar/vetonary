const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
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


const Users = mongoose.model('users', usersSchema);

module.exports = Users;