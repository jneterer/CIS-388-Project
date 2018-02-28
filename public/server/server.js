const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const ensure = require('connect-ensure-login');
ensure.defaultRedirectUrl = '/login';
ensure.defaultReturnUrl = '/home';

const port = process.env.PORT || 3000;

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

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.sendFile('/login.html', {root: __dirname + '../../login'});
});

app.post('/login', passport.authenticate('local', {successReturnToOrRedirect: '/home', failureRedirect: '/login'}), (req, res) => {
  res.redirect('/home');
});

app.get('/create_account', (req, res) => {
  res.sendFile('/create_account.html', {root: __dirname + '../../create_account'});
});

app.get('/home', ensure.ensureLoggedIn('/login'), (req, res) => {
  res.sendFile('/home.html', {root: __dirname + '../../home'});
});

app.get('/my_library', ensure.ensureLoggedIn('/login'), (req, res) => {
  res.sendFile('/my_library.html', {root: __dirname + '../../my_library'});
});

app.get('/active_books', ensure.ensureLoggedIn('/login'), (req, res) => {
  res.sendFile('/active_books.html', {root: __dirname + '../../active_books'});
});

app.get('/book_notes', ensure.ensureLoggedIn('/login'), (req, res) => {
  res.sendFile('/book_notes.html', {root: __dirname + '../../book_notes'});
});

app.get('/book_quotes', ensure.ensureLoggedIn('/login'), (req, res) => {
  res.sendFile('/book_quotes.html', {root: __dirname + '../../book_quotes'});
});

app.get('/about', ensure.ensureLoggedIn('/login'), (req, res) => {
  res.sendFile('/about.html', {root: __dirname + '../../about'});
});

app.get('/contact_us', ensure.ensureLoggedIn('/login'), (req, res) => {
  res.sendFile('/contact_us.html', {root: __dirname + '../../contact_us'});
});

app.get('/account', ensure.ensureLoggedIn('/login'), (req, res) => {
  res.sendFile('/account.html', {root: __dirname + '../../account'});
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// Listen on port 3000
app.listen(port, function() {
    console.log(`Express app listening on port ${port}`);
});
