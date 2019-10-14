var config = require('./config');
var mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: 100, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};
module.exports = function () {
  //mongoose.set('debug', config.debug);
  var db = mongoose.connect('mongodb://heroku_jvp8kncs:tloup834159i629f624onibgbn@ds117101.mlab.com:17101/heroku_jvp8kncs', options).then(
    () => {
      console.log("connected to mongoDB")
    },
    (err) => {
      console.log("err", err);
    }
  );
  require('../app/models/user.model');
  require('../app/models/exam.model');
  return db;
}

