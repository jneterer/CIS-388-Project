const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const engine = require('consolidate');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {authenticate} = require('./authenticate/authenticate');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '../../../public'));
app.use(express.static(__dirname + '../../../Images'));

//GET login.html
app.get('/login', (req, res) => {
  res.sendFile('/login.html', {root: __dirname + '../../login'});
});

// POST login
app.post('/login', (req, res, next) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);
});

// GET create_account.html
app.get('/create_account', (req, res) => {
  res.sendFile('/createAccount.html', {root: __dirname + '../../create_account'});
});

app.post('/create_account', (req, res) => {
  var body = _.pick(req.body, ['first_name', 'last_name', 'email', 'password', 'phone']);
  var pass2 = _.pick(req.body, ['confirmPassword']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send();
  });
});

app.get('/home', authenticate, (req, res) => {
  res.sendFile('/home.html', {root: __dirname + '../../home'});
});

// Listen on port 3000
app.listen(3000, function() {
    console.log('Express app listening on port 3000');
});
