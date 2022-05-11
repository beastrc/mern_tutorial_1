'use strict';
//import dependency
var rfr = require('rfr'),
  constant = rfr('/server/shared/constant'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Schema.Types.ObjectId;
const post_jobs = require('./postJobs');

var utils = rfr('/server/shared/utils');

var jobStatus = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: post_jobs
  },
  status: { type: Number },
  rating_seeker: { type: Number },
  rating_poster: { type: Number },
  declined_by: { type: String, default: '' },
  created_at: { type: Date, default: utils.getCurrentDate() },
  updated_at: { type: Date, default: utils.getCurrentDate() }
});

jobStatus.statics.getCount = function (query, callback) {
  this.find(query || {}).count().exec(callback);
};

jobStatus.statics.updateQuery = function (data, callback) {
  var _that = this;
  _that.find({ user_id: data.user_id, job_id: data.job_id }).exec(function (err, res) {
    if (!err) {
      if (res.length > 0 && Number(data.status) == res[0].status && Number(data.status) != constant['JOB_STEPS']['J_COMPLETE']) {
        var msg = '';
        switch (Number(data.status)) {
          case 101: msg = constant['APPLIED_ERROR'];
            break;
          case 102:
          case 103: msg = constant['INPROGRESS_ERROR'];
            break;
        }
        callback(true, msg);
      } else {
        if (res.length > 0) {
          data.updated_at = utils.getCurrentDate()();
          _that.findOneAndUpdate({ user_id: data.user_id, job_id: data.job_id }, { $set: data }, { new: true }, callback);
        } else {
          _that.create(data, callback);
        }
      }
    } else {
      callback(err, res);
    }
  })
};

jobStatus.statics.fetchAll = function (data, callback) {
  this.aggregate([
    { "$match": { "user_id": mongoose.Types.ObjectId(data.user_id) } },
    { "$sort": { "_id": -1 } },
    { "$limit": data.skip + data.limit },
    { "$skip": data.skip },
    {
      "$lookup": {
        "from": "post_jobs",
        "localField": "job_id",
        "foreignField": "_id",
        "as": "job_details"
      }
    },
    {
      "$lookup": {
        "from": "negotiate_terms",
        "localField": "job_id",
        "foreignField": "jobId",
        "as": "n_terms_status"
      }
    },
    {
      "$addFields": {
        "n_terms_status": {
          "$map": {
            "input": {
              "$filter": {
                "input": "$n_terms_status",
                "as": "tmp",
                "cond": {
                  "$eq": ["$$tmp.seekerId", data.user_id]
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
};

jobStatus.statics.findBarIdStatus = function (data, callback) {
  this.aggregate([
    { "$match": { "job_id": mongoose.Types.ObjectId(data.job_id), 'status': { '$gte': data.status } } },
    {
      "$lookup": {
        "from": "users",
        "localField": "user_id",
        "foreignField": "_id",
        "as": "details"
      }
    },
    {
      "$lookup": {
        "from": "stripe_accounts",
        "localField": "user_id",
        "foreignField": "user_id",
        "as": "accountCreated"
      }
    },
    {
      "$lookup": {
        "from": "stripe_charges",
        "localField": "user_id",
        "foreignField": "poster_id",
        "as": "transferFunds"
      }
    },
    { "$project": { "user_id": 1, "_id": 0, "freeze_activity": "$details.freeze_activity", "accountCreated": 1, "transferFunds": 1 } }
  ]).exec(callback);
};

jobStatus.statics.findQuery = function (queryObj = {}, callback) {
  this.find(queryObj.query || {}, queryObj.options || {}).populate('job_id').sort(queryObj.sortOption || {}).exec(callback);
};

jobStatus.statics.updateStatusQuery = function (queryObj = {}, data, callback) {
  this.findOneAndUpdate(queryObj.query || {}, { $set: data }, { new: true, upsert: false }, callback);
};

module.exports = mongoose.model('job_status', jobStatus);
