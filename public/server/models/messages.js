const mongoose = require('mongoose');

// Defining Book Notes Schema
var Message = mongoose.model('Message', {
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

module.exports = {Message};
