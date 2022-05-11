'use strict';
//import dependency
var rfr = require('rfr'),
mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = mongoose.Schema.Types.ObjectId;

var utils = rfr('/server/shared/utils'),
constant = rfr('/server/shared/constant');

var stripeAccounts = new Schema ({
  user_id: {type: ObjectId},
  stripe_user_id: {type: String},
  stripe_refresh_token: {type: String},
  stripe_token_type: {type: String},
  status: {type: Number, default: constant['STRIPE_ACCOUNT_STATUS']['CREATED']},
  created_at: {type: Date, default: utils.getCurrentDate()},
  updated_at: {type: Date, default: utils.getCurrentDate()}
});

stripeAccounts.statics.createQuery = function(data, callback) {
  this.create(data, callback);
};

stripeAccounts.statics.findQuery = function(queryObj = {}, callback) {
  this.find(queryObj.query || {}, queryObj.options || {}).sort(queryObj.sortOption || {}).exec(callback);
};

stripeAccounts.statics.updateQuery = function(queryObj = {}, callback) {
  this.findOneAndUpdate(queryObj.query, { $set: queryObj.data }, {new: true}, callback);
};

stripeAccounts.statics.findAccountDetails = function(queryObj = {}, callback) {
  if (queryObj['userRole'] === constant['ROLE']['SEEKER']) {
    this.find({ 'user_id': mongoose.Types.ObjectId(queryObj.userId) }).exec(callback);
  } else {
    this.aggregate([
      { '$match': { 'user_id':  mongoose.Types.ObjectId(queryObj.userId) } },
      {
        '$lookup': {
          'from': 'stripe_charges',
          'localField': 'user_id',
          'foreignField': 'poster_id',
          'as': 'tranfer_funds'
        }
      },
      {
        "$addFields": {
          "tranfer_funds": {
            "$map": {
              "input": {
                "$filter": {
                  "input": "$tranfer_funds",
                  "as": "tmp",
                  "cond": {
                      "$and": [
                        {"$eq": [ "$$tmp.job_id", mongoose.Types.ObjectId(queryObj.jobId) ] },
                        {"$gte": [ "$$tmp.status", constant['PAYMENT_STATUS']['FUND_TRANSFER_REQUEST_SENT'] ] }
                      ]
                  }
                }
              },
              "as": "st",
              "in": "$$st.status"
            }
          }
        }
      }
    ]).exec(callback);
  }
};

module.exports = mongoose.model('stripe_accounts', stripeAccounts);
