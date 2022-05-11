'use strict';
//import dependency
var rfr = require('rfr'),
mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = mongoose.Schema.Types.ObjectId;

var utils = rfr('/server/shared/utils');

var loggedInUsers = new Schema ({
  user_id: {type: ObjectId},
  token: {type: String},
  created_at: {type: Date, default: utils.getCurrentDate()},
  updated_at: {type: Date, default: utils.getCurrentDate()}
});

loggedInUsers.statics.saveData = function(data, callback) {
  this.create(data, callback);
}

loggedInUsers.statics.findOneQuery = function(query, callback) {
  this.findOne(query, callback);
};

loggedInUsers.statics.removeEntry = function(id, callback) {
  this.remove({_id: id}, callback);
};

module.exports = mongoose.model('logged_in_users', loggedInUsers);
