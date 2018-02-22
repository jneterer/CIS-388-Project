require('./config/config');

var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '../../../public'));
app.use(express.static(__dirname + '../../../Images'));

app.post('/login', (req, res) => {
  var user = new User({
    first_name: 'Jacob',
    last_name: 'Neterer',
    email: 'jacobneterer@gmail.com',
    password: '1234567890',
    phone: '7178301858'
  });
  user.save((err) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Saved!');
    }
  })
});

// Sends login.html
app.get('/login', (req, res) => {
  res.sendFile('/login.html', {root: __dirname + '../../login'});
});

// Sends create_account.html
app.get('/create_account', (req, res) => {
  res.sendFile('/createAccount.html', {root: __dirname + '../../create_account'});
})

// Listen on port 3000
app.listen(3000, function() {
    console.log('Express app listening on port 3000');
});
