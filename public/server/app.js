const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const ensure = require('connect-ensure-login');
ensure.defaultRedirectUrl = '/login';
ensure.defaultReturnUrl = '/home';

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');

// Express Application
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '../../../public'));
app.use(express.static(__dirname + '../../../public/home'));
app.use(express.static(__dirname + '../../../Images'));

app.use(session({
  secret: 'aye1',
  saveUnitialized: true,
  resave: true
}));

//GET login.html
app.use(passport.initialize());
app.use(passport.session());

const auth = require('./authenticate/passport');


// passport.serializeUser(function(user, done) {
//   done(null, user._id);
// });
//
// passport.deserializeUser(function(_id, done) {
//   console.log('heyyo');
//   User.findById(_id, function(err, user) {
//     done(err, user);
//   });
// });
//
// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password'
//   }, function(email, password, done) {
//     User.findOne({email}, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Email or password is incorrect.' });
//       }
//       bcrypt.compare(password, user.password, (err, res) => {
//         if (res) {
//           return done(null, user);
//         } else {
//           return done(null, false, { message: 'Email or password is incorrect.' });
//         }
//       });
//     });
//   })
// );

app.get('/login', (req, res) => {
  res.sendFile('/login.html', {root: __dirname + '../../login'});
});

app.post('/login', passport.authenticate('local', {successReturnToOrRedirect: '/', failureRedirect: '/login'}), (req, res) => {
  res.redirect('/home');
});

app.get('/home', ensure.ensureLoggedIn('/login'), (req, res) => {
  res.sendFile('/home.html', {root: __dirname + '../../home'});
});


app.get('/my_library', ensure.ensureLoggedIn('/login'), (req, res) => {
  res.sendFile('/my_library.html', {root: __dirname + '../../my_library'});
});


// Listen on port 3000
app.listen(3000, function() {
    console.log('Express app listening on port 3000');
});
