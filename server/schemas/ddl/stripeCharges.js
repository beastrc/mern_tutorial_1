'use strict';
//import dependency
var rfr = require('rfr'),
mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = mongoose.Schema.Types.ObjectId;

var utils = rfr('/server/shared/utils'),
constant = rfr('/server/shared/constant');

var stripeCharges = new Schema({
  job_id: {type: ObjectId},
  poster_id: {type: ObjectId},
  seeker_id: {type: ObjectId},
  stripe_source_account_id: {type: String},
  stripe_charge_id: {type: String},
  amount: {type: Number},
  stripe_created_at: {type: Date},
  status: {type: Number, default: constant['PAYMENT_STATUS']['FUND_TRANSFER_REQUEST_SENT']},
  stripe_balance_transaction: {type: String},
  created_at: {type: Date, default: utils.getCurrentDate()},
  updated_at: {type: Date, default: utils.getCurrentDate()}
});

stripeCharges.statics.createQuery = function(data, callback) {
  this.create(data, callback);
};

stripeCharges.statics.findQuery = function(queryObj = {}, callback) {
  this.find(queryObj.query || {}, queryObj.options || {}).sort(queryObj.sortOption || {}).exec(callback);
};

stripeCharges.statics.updateQuery = function(queryObj = {}, callback) {
  this.findOneAndUpdate(queryObj.query, { $set: queryObj.data }, {new: true}, callback);
};

stripeCharges.statics.updateQuery = function(queryObj = {}, callback) {
  this.findOneAndUpdate(queryObj.query, { $set: queryObj.data }, {new: true}, callback);
};

stripeCharges.statics.findDetails = function(queryObj = {}, callback) {
  this.aggregate([
    { '$match': {'job_id': mongoose.Types.ObjectId(queryObj.jobId), 'poster_id': mongoose.Types.ObjectId(queryObj.userId), 'status': queryObj.status}},
    {
      '$lookup': {
        'from': 'stripe_accounts',
        'localField': 'seeker_id',
        'foreignField': 'user_id',
        'as': 'seeker_details'
      }
    }
  ]).exec(callback);
};

module.exports = mongoose.model('stripe_charges', stripeCharges);
