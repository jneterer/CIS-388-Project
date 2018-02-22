var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//var uri = 'mongodb://bookshelf-shard-00-00-fieye.mongodb.net:27017,bookshelf-shard-00-01-fieye.mongodb.net:27017,bookshelf-shard-00-02-fieye.mongodb.net:27017/bookshelf?ssl=true&replicaSet=Bookshelf-shard-0&authSource=admin';
var uri = 'mongodb://bookshelf-shard-00-00-fieye.mongodb.net:27017,booksheslf-shard-00-01-fieye.mongodb.net:27017,bookshelf-shard-00-02-fieye.mongodb.net:27017/bookshelf?ssl=true&replicaSet=Bookshelf-shard-0&authSource=admin'
mongoose.connect(uri, {user: 'jnetererAdmin', pass: '806260#Ae'}, (err) => {
  if (!err)
    console.log('We are connected to DB!');
  else
    console.log(err);
});

module.exports = {mongoose};
