'use strict';
//import dependency
var rfr = require('rfr'),
mongoose = require('mongoose'),
Schema = mongoose.Schema;

var constant = rfr('/server/shared/constant'),
utils = rfr('/server/shared/utils');

var employmentTypes = new Schema ({
  name: {type: String},
  status: {type: Number, default: constant['STATUS']['ACTIVE']},
  created_at: {type: Date, default: utils.getCurrentDate()},
  updated_at: {type: Date, default: utils.getCurrentDate()}
});

employmentTypes.statics.findQuery = function(obj = {}, callback) {
  this.find(obj.query || {}, obj.projection || {}).sort(obj.sortOption || {}).exec(callback);
}

employmentTypes.statics.findJobType = function(id, callback) {
  this.findOne({_id : id}, callback);
}

module.exports = mongoose.model('employment_types', employmentTypes);
