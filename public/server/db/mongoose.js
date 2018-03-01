var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_HOST, (err) => {
  if (!err) {
    console.log('We are connected to DB!');
  }
  else {
    console.log(err);
  }
});

module.exports = {mongoose};
