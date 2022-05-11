'use strict';
//import dependency
var rfr = require('rfr'),
mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = mongoose.Schema.Types.ObjectId;

var utils = rfr('/server/shared/utils');

var wNineInfo = new Schema ({
  user_id: { type: ObjectId },
  legal_name: { type: String, default: '' },
  street_address: { type: String, default: '' },
  city: { type: String, default: '' },
  state_id: { type: String, default: '' },
  zipcode: { type: String, default: '' },
  tin: {
    type: { type: String, default: '' },
    value: { type: String, default: '' }
  },
  fed_tax_classification: {
    id: { type: String, default: '' },
    other_value: { type: String, default: '' }
  },
  created_at: {type: Date, default: utils.getCurrentDate()},
  updated_at: {type: Date, default: utils.getCurrentDate()}
});

wNineInfo.statics.createQuery = function(data, callback) {
  this.create(data, callback);
};

wNineInfo.statics.findQuery = function(queryObj = {}, callback) {
  this.find(queryObj.query || {}, queryObj.options || {}).sort(queryObj.sortOption || {}).exec(callback);
};

wNineInfo.statics.updateQuery = function(queryObj = {}, data, callback) {
  this.findOneAndUpdate(queryObj.query || {}, {$set: data}, {new: true, upsert: true}, callback);
};

module.exports = mongoose.model('w_nine_informations', wNineInfo);
