const mongoose = require('mongoose');

// Defining Book Notes Schema
var Book_Quote = mongoose.model('Book_Quote', {
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  book_title: {
    type: String,
    required: true
  },
  quote_title: {
    type: String,
    required: true,
    trim: true
  },
  date_added: {
    type: Date,
    required: false,
    default: new Date()
  },
  quote: {
    type: String,
    required: true
  }
});

module.exports = {Book_Quote};
