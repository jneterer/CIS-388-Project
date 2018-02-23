var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Defining User Schema
var UserSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
  },
  password: {
    type: String,
    min: [6, 'Minimum of 6 characters'],
    require: true
  },
  phone: {
    type: String,
    required: false
  },
  books: {
    type: Array,
    required: false
  }
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);

};

var User = mongoose.model('User', UserSchema)
module.exports = {User};
