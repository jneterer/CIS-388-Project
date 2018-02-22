require('./config/config');

var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

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

app.get('/login', (req, res) => {
  res.sendFile('/login.html', {root: __dirname + '../../login'});
});

// Listen on port 3000
app.listen(3000, function() {
    console.log('Express app listening on port 3000');
});
