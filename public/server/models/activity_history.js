const mongoose = require('mongoose');

// Defining Book Notes Schema
var Activity_History = mongoose.model('Activity_History', {
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
  date_returned: {
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
  },
  post_activity_comments: {
    type: String,
    required: false
  }
});

module.exports = {Activity_History};
