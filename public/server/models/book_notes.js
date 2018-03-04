const mongoose = require('mongoose');

// Defining Book Notes Schema
var Book_Note = mongoose.model('Book_Note', {
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  book_title: {
    type: String,
    required: true
  },
  note_title: {
    type: String,
    required: true,
    trim: true
  },
  date_added: {
    type: Date,
    required: false,
    default: new Date()
  },
  note: {
    type: String,
    required: true
  }
});

module.exports = {Book_Note};
