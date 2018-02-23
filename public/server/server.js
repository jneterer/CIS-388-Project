require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const engine = require('consolidate');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');

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
app.post('/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  console.log(body.password + ' ' + body.email);
  // var user = new User({
  //   first_name: 'Jacob',
  //   last_name: 'Neterer',
  //   email: 'jacobneterer@gmail.com',
  //   password: '1234567890',
  //   phone: '7178301858'
  // });
  // user.save((err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   else {
  //     console.log('Saved!');
  //   }
  // });
});

// GET create_account.html
app.get('/create_account', (req, res) => {
  res.sendFile('/createAccount.html', {root: __dirname + '../../create_account'});
});

app.post('/create_account', (req, res) => {
  var body = _.pick(req.body, ['first_name', 'last_name', 'email', 'password1', 'password2', 'phone']);
  console.log(body);
  
  // user.save((err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   else {
  //     console.log('Saved!');
  //   }
  // });
});

// Listen on port 3000
app.listen(3000, function() {
    console.log('Express app listening on port 3000');
});
