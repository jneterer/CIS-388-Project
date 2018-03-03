const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const ensure = require('connect-ensure-login');
const _ = require('lodash');
const path = require('path');
const hbs = require('hbs');
const port = process.env.PORT || 3000;

// Express Application
var app = express();

// In the case that it is run locally, require the config files
if (port === 3000) {
  // Not accessible in Heroku
  require('./config/config');
}
else {
  // Only want this set if this is Heroku
  app.set('views', __dirname + '/views');
}
// Registers all partials
hbs.registerPartials(__dirname + '/views/partials');
// Sets the view engine to .hbs
app.set('view engine', 'hbs');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '../../../public'));
app.use(express.static(__dirname + '../../../public/home'));
app.use(express.static(__dirname + '../../../Images'));

app.use(session({
  secret: process.env.SECRET,
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

app.post('/create_account', (req, res) => {
  var body = _.pick(req.body, ['first_name', 'last_name', 'email', 'password', 'confirmPassword', 'phone']);
  var user = new User(body);

  if (body.password !== body.confirmPassword) {
    console.log(`Password: ${bodypassword} does not equal confirmPassword: ${body.confirmPassword}`)
    res.redirect('create_account');
  } else {
    user.save();
    res.redirect('/login');
  }
});

app.get('/home', ensure.ensureLoggedIn('/login'), (req, res) => {
  //res.sendFile('/home.html', {root: __dirname + '../../home'});
  res.render('home.hbs', {
    first_name: req.user.first_name,
    home: true,
    my_library: false,
    active_books: false,
    book_notes: false,
    book_quotes: false,
    about: false,
    contact_us: false,
    account: false
  });
});

app.get('/my_library', ensure.ensureLoggedIn('/login'), (req, res) => {
  //res.sendFile('/my_library.html', {root: __dirname + '../../my_library'});
  res.render('my_library.hbs', {
    home: false,
    my_library: true,
    active_books: false,
    book_notes: false,
    book_quotes: false,
    about: false,
    contact_us: false,
    account: false
  });
});

app.get('/active_books', ensure.ensureLoggedIn('/login'), (req, res) => {
  //res.sendFile('/active_books.html', {root: __dirname + '../../active_books'});
  res.render('active_books.hbs', {
    home: false,
    my_library: false,
    active_books: true,
    book_notes: false,
    book_quotes: false,
    about: false,
    contact_us: false,
    account: false
  });
});

app.get('/book_notes', ensure.ensureLoggedIn('/login'), (req, res) => {
  //res.sendFile('/book_notes.html', {root: __dirname + '../../book_notes'});
  res.render('book_notes.hbs', {
    home: false,
    my_library: false,
    active_books: false,
    book_notes: true,
    book_quotes: false,
    about: false,
    contact_us: false,
    account: false
  });
});

app.get('/book_quotes', ensure.ensureLoggedIn('/login'), (req, res) => {
  //res.sendFile('/book_quotes.html', {root: __dirname + '../../book_quotes'});
  res.render('book_quotes.hbs', {
    home: false,
    my_library: false,
    active_books: false,
    book_notes: false,
    book_quotes: true,
    about: false,
    contact_us: false,
    account: false
  });
});

app.get('/about', ensure.ensureLoggedIn('/login'), (req, res) => {
  //res.sendFile('/about.html', {root: __dirname + '../../about'});
  res.render('about.hbs', {
    home: false,
    my_library: false,
    active_books: false,
    book_notes: false,
    book_quotes: false,
    about: true,
    contact_us: false,
    account: false
  });
});

app.get('/contact_us', ensure.ensureLoggedIn('/login'), (req, res) => {
  //res.sendFile('/contact_us.html', {root: __dirname + '../../contact_us'});
  res.render('contact_us.hbs', {
    home: false,
    my_library: false,
    active_books: false,
    book_notes: false,
    book_quotes: false,
    about: false,
    contact_us: true,
    account: false
  });
});

app.get('/account', ensure.ensureLoggedIn('/login'), (req, res) => {
  //res.sendFile('/account.html', {root: __dirname + '../../account'});
  res.render('account.hbs', {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    home: false,
    my_library: false,
    active_books: false,
    book_notes: false,
    book_quotes: false,
    about: false,
    contact_us: false,
    account: true
  });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// Listen on port 3000
app.listen(port, function() {
    console.log(`Express app listening on port ${port}`);
});
