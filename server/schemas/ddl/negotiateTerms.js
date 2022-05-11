'use strict';
//import dependency
var rfr = require('rfr'),
constant = rfr('/server/shared/constant'),
mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = mongoose.Schema.Types.ObjectId;

var utils = rfr('/server/shared/utils');

var nTerms = new Schema({
  seekerId: {type: ObjectId},
  jobId: {type: ObjectId},
  posterId: {type: ObjectId},
  rate: {type: Number},
  rateType: {type: String},
  hours: {type: Number},
  hoursType: {type: String},
  subTotal: {type: String},
  total: {type: String},
  currentRate: {type: Number},
  paymentDetails: [{
    rate: {type: Number},
    delivery: {type: String},
    dueDate: {type: String},
    milestone: {type: Number},
    status: {type: Number, default: constant['DELIVERABLE_STATUS']['PENDING']},
    filepath: {type: String, default: ''},
    filename: {type: String, default: ''}
  }],
  status: {type: Number, default: constant['N_TERMS_STATUS']['NOT_SENT']},
  created_at: {type: Date, default: utils.getCurrentDate()},
  updated_at: {type: Date, default: utils.getCurrentDate()}
});

nTerms.statics.saveData = function(data, callback) {
  this.create(data, callback);
};

nTerms.statics.findQuery = function(queryObj = {}, callback) {
  this.find(queryObj.query || {}, queryObj.options || {}).sort(queryObj.sortOption || {}).exec(callback);
};

nTerms.statics.updateQuery = function(queryObj = {}, data, callback) {
  this.findOneAndUpdate(queryObj.query || {}, {$set: data}, {new: true, upsert: false}, callback);
};

nTerms.statics.updateOne = function(queryObj = {}, data, callback) {
  this.update(queryObj.query || {}, {$set: data}, {new: true, upsert: false}, callback);
};

nTerms.statics.getDeliverables = function(data, callback) {
  let approvedStatus = constant['DELIVERABLE_STATUS']['APPROVED'];
  let condition = {
    $and: [
      {
        $or: [
          {
            'paymentDetails.dueDate': { $gte: utils.getCurrentEstDate() }
          },
          {
            'paymentDetails.dueDate': { $eq: '' }
          }
        ]
      },
      {
        'paymentDetails.status': { $lt: approvedStatus }
      }
    ]
  };
  if (data['deliverableType'] === 'past') {
    condition = {
      $and: [
        {
          'paymentDetails.dueDate': { $lt: utils.getCurrentEstDate() }
        },
        {
          'paymentDetails.status': { $lt: approvedStatus }
        }
      ]
    };
  } else if (data['deliverableType'] === 'completed') {
    condition = {
      'paymentDetails.status': { $gte: approvedStatus }
    };
  }

  let sortVar = {};
  sortVar[data['sortBy']] = data['sortOrder'];
  if (data['count']) {
    this.aggregate([
      { $match: data.query },
      { $project: {'paymentDetails': 1, 'seekerId': 1, '_id': 0, 'rate': 1, 'rateType': 1} },
      { $unwind: '$paymentDetails' },
      { $match: condition }
    ]).exec(callback);

  } else {
    this.aggregate([
      { $match: data.query },
      { $project: {'paymentDetails': 1, 'seekerId': 1, '_id': 0, 'rate': 1, 'rateType': 1} },
      { $unwind: '$paymentDetails' },
      { $match: condition },
      { $sort: sortVar },
      { $limit: data.skip + data.limit },
      { $skip: data.skip }
    ]).exec(callback);
  }
};

nTerms.statics.getNonPaidDeliverables = function(data, callback) {
  this.aggregate([
    { $match: data.query },
    { $project: { 'paymentDetails': 1, '_id': 0 } },
    { $unwind: '$paymentDetails' },
    { $match: { 'paymentDetails.status': { $ne: constant['DELIVERABLE_STATUS']['PAID'] } } },
    { $sort:  { 'paymentDetails.milestone': 1, 'paymentDetails.dueDate': 1 } },
  ]).exec(callback);
};

module.exports = mongoose.model('negotiate_terms', nTerms);
