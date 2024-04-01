const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  createDate: {
    type: Date
  },
  fullname: {
    type: String
  },
  badword: {
    type: String
  },
});


const Guest = mongoose.model('guest', guestSchema);

module.exports = Guest;