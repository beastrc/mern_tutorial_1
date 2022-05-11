var rfr = require('rfr'),
Mongoose = require('mongoose');

var config = rfr('/server/shared/config'),
utils = rfr('/server/shared/utils');

(function() {
  var env = config['env'] || process.env.NODE_ENV;
  var dbObj = config['database'];

  if (env !== 'development' || dbObj.username) {
    Mongoose.connect('mongodb://' + dbObj['username'] + ':' + dbObj['password'] + '@' + dbObj['host'] + ':' + dbObj['port'] + '/' + dbObj['db']);
  } else {
    Mongoose.connect('mongodb://' + dbObj['host'] + ':' + dbObj['port'] + '/' + dbObj['db']);
  }

  var con = Mongoose.connection;
  con.once('open', function() {
    utils.log('Connection with database succeeded');
    rfr('/server/schemas/dml/index');
  });
  con.on('error', function(err) {
    utils.log('Connection Error -->', err);
    utils.writeErrorLog('index', 'IIFE', 'Error while connecting to database', err);
  });
}());