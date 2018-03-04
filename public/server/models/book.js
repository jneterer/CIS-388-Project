const mongoose = require('mongoose');

// Defining Book UserSchema
var Book = mongoose.model('Book', {
  book_title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  authors: {
    type: String,
    required: false
  },
  actively_lending: {
    type: Boolean,
    required: false,
    default: false
  },
  ISBN: {
    type: String,
    required: false
  },
  gift_first_name: {
    type: String,
    requred: false,
    trim: true
  },
  gift_last_name: {
    type: String,
    requred: false,
    trim: true
  },
  date_gifted: {
    type: Date,
    required: false
  }
});

module.exports = {Book};
