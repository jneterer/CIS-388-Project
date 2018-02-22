const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoClient = require('mongodb').MongoClient;
const f = require('util').format;

var uri = 'mongodb://bookshelf-shard-00-00-fieye.mongodb.net:27017,bookshelf-shard-00-01-fieye.mongodb.net:27017,bookshelf-shard-00-02-fieye.mongodb.net:27017/bookshelf?ssl=true&replicaSet=Bookshelf-shard-0&authSource=admin';
// Found answer on how to do this correctly here https://www.questarter.com/q/cannot-connect-to-mongodb-in-azure-27_48029723.html
MongoClient.connect(uri, {user: 'jnetererAdmin', password: '806260#Ae'}, function(err, client) {
    if(!err) {
        console.log('We are connected');
    }
    else {
        console.log(err);
    }
});
//
// var db = mongoose.connection;
//
// // Use sessions for tracking logins
// app.use(session({
//     secret: 'whatever',
//     resave: true,
//     saveUninitialized: false,
//     store: new MongoClient({
//         mongooseConnection: db
//     })
// }));
//
// // Parse incoming requests
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false}));
//
// // Serve static files from template
// app.use(express.static(__dirname + '../../public'));
//
// // Includes routes
// var routes = require('./router.js');
// app.use('./', routes);
//
// // Catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     var err = new Error('File Not Found');
//     err.status = 404;
//     next(err);
// });
//
// // Error handler
// // Define as the last app.use callback
// app.use(function (err, req, res, next) {
//     res.status(err.status || 500);
//     res.send(err.message);
// });

// Listen on port 3000
app.listen(3000, function() {
    console.log('Express app listening on port 3000');
});
