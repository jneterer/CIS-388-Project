const {mongoose} = require('../db/mongoose');
const {User} = require('../models/user');
const bcrypt = require('bcryptjs');

var userExists = (User) => {
  var user = User;
  user.statics.findByCredentials(user.email).then((foundUser) => {
    if (!foundUser) {
      return false;
    }
    else {
      return passTest(user.password, foundUser.password);
    }
  }).catch((e) => res.status(400).send(e));
};

var passTest = (password, hashedPassword) => {
  if (password !== hashedPassword) {
    return false;
  }
  else {
    return true;
  }
};

module.exports = {userExists};
