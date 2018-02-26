const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
var {mongoose} = require('../db/mongoose');
var {User} = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function(email, password, done) {
    User.findOne({email}, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Email or password is incorrect.' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Email or password is incorrect.' });
        }
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  console.log(user._id);
  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
  console.log('heyyo');
  User.findById(_id, function(err, user) {
    done(err, user);
  });
});
