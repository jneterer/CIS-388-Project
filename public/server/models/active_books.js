const mongoose = require('mongoose');

// Defining Book Notes Schema
var Active_Book = mongoose.model('Active_Book', {
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  book_title: {
    type: String,
    required: true
  },
  loaned_to: {
    type: String,
    required: true,
    trim: true
  },
  date_loaned: {
    type: Date,
    required: true,
    default: new Date()
  },
  phone: {
    type: String,
    required: false
  },
  email: {
      type: String,
      required: false
  },
  comments: {
    type: String,
    required: false
  }
});

module.exports = {Active_Book};
