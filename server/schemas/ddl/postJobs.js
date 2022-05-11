'use strict';
//import dependency
var rfr = require('rfr'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Schema.Types.ObjectId;

var constant = rfr('/server/shared/constant'),
  utils = rfr('/server/shared/utils');

var postJobs = new Schema({
  jobType: { type: String, required: true },
  paymentType: { type: String, required: true },
  jobHeadline: { type: String, required: true, maxlength: 150 },
  practiceArea: { type: Array },
  skillsNeeded: { type: Array },
  others: { type: String },
  showOthers: { type: String },
  present: { type: String },
  jobDescription: { type: String, required: true, maxlength: 2000 },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  setting_id: { type: String },
  estimatedStartDate: { type: String },
  duration: { type: Number },
  durationPeriod: { type: String },
  rate: { type: Number },
  rateType: { type: String },
  hours: { type: Number },
  hoursType: { type: String },
  subTotal: { type: String },
  total: { type: String },
  currentRate: { type: Number },
  paymentDetails: [
    {
      rate: { type: Number },
      delivery: { type: String },
      dueDate: { type: String }
    }
  ],
  userId: { type: ObjectId },
  inProgressStep: { type: Boolean, default: false },
  status: { type: Number, default: constant['STATUS']['ACTIVE'] },
  created_at: { type: Date, default: utils.getCurrentDate() },
  updated_at: { type: Date, default: utils.getCurrentDate() },
  posted_at: { type: Date, default: utils.getCurrentDate() }
});

postJobs.statics.saveData = function(data, callback) {
  this.create(data, callback);
};

postJobs.statics.getJobData = function(data, callback) {
  this.findOne(data, callback);
};

postJobs.statics.findQuery = function(queryObj = {}, callback) {
  this.find(queryObj.query || {}, queryObj.options || {})
    .skip(queryObj.skip || 0)
    .limit(queryObj.limit || 0)
    .sort(queryObj.sortOption || {})
    .exec(callback);
};

postJobs.statics.updateQuery = function(id, data, callback) {
  this.findOneAndUpdate(
    { _id: id },
    { $set: data },
    { new: true, upsert: false },
    callback
  );
};

postJobs.statics.getCount = function(queryObj = {}, callback) {
  this.find(queryObj.query || {})
    .count()
    .exec(callback);
};

postJobs.statics.getJobsByUserId = function(data, callback) {
  this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(data.userId) } },
    { $sort: { status: -1, posted_at: -1, _id: -1 } },
    { $limit: data.skip + data.limit },
    { $skip: data.skip },
    {
      $lookup: {
        from: 'job_statuses',
        localField: '_id',
        foreignField: 'job_id',
        as: 'total_applied'
      }
    },
    {
      $addFields: {
        total_applied: {
          $map: {
            input: '$total_applied',
            as: 'st',
            in: '$$st.status'
          }
        }
      }
    }
  ]).exec(callback);
};

postJobs.statics.getInvitablePostJobs = function(data, callback) {
  this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(data.userId) } },
    { $sort: { status: -1, posted_at: -1, _id: -1 } },
    {
      $lookup: {
        from: 'job_statuses',
        localField: '_id',
        foreignField: 'job_id',
        as: 'total_applied'
      }
    },
    {
      $addFields: {
        total_applied: {
          $map: {
            input: '$total_applied',
            as: 'st',
            in: '$$st.status'
          }
        }
      }
    }
  ]).exec(callback);
};

postJobs.statics.getAllJobs = function(data, callback) {
  var stateObj =
    data.states && data.states.length ? { state: { $in: data.states } } : {};
  var practiceAreasArray = _.map(data.practiceAreas, 'value');
  var areaObj =
    data.practiceAreas && data.practiceAreas.length
      ? { 'practiceArea.value': { $in: practiceAreasArray } }
      : {};

  this.aggregate([
    {
      $match: {
        $and: [
          { userId: { $ne: mongoose.Types.ObjectId(data.user_id) } },
          { status: constant['STATUS']['ACTIVE'] },
          { inProgressStep: { $ne: true } },
          areaObj,
          stateObj
        ]
      }
    },
    { $sort: { posted_at: Number(data.selectedOrder), _id: -1 } },
    { $limit: data.skip + data.limit },
    { $skip: data.skip },
    {
      $lookup: {
        from: 'saved_jobs',
        localField: '_id',
        foreignField: 'job_id',
        as: 'is_saved'
      }
    },
    {
      $lookup: {
        from: 'job_statuses',
        localField: '_id',
        foreignField: 'job_id',
        as: 'job_step'
      }
    },
    {
      $lookup: {
        from: 'negotiate_terms',
        localField: '_id',
        foreignField: 'jobId',
        as: 'n_terms_status'
      }
    },
    {
      $addFields: {
        is_saved: {
          $map: {
            input: {
              $filter: {
                input: '$is_saved',
                as: 'tmp',
                cond: {
                  $eq: ['$$tmp.user_id', data.user_id]
                }
              }
            },
            as: 'user',
            in: '$$user.job_id'
          }
        },
        job_step: {
          $map: {
            input: {
              $filter: {
                input: '$job_step',
                as: 'tmp',
                cond: {
                  $eq: ['$$tmp.user_id', data.user_id]
                }
              }
            },
            as: 'st',
            in: '$$st.status'
          }
        },
        declined_by: {
          $map: {
            input: {
              $filter: {
                input: '$job_step',
                as: 'tmp',
                cond: {
                  $eq: ['$$tmp.user_id', data.user_id]
                }
              }
            },
            as: 'st',
            in: '$$st.declined_by'
          }
        },
        n_terms_status: {
          $map: {
            input: {
              $filter: {
                input: '$n_terms_status',
                as: 'tmp',
                cond: {
                  $eq: ['$$tmp.seekerId', data.user_id]
                }
              }
            },
            as: 'st',
            in: '$$st.status'
          }
        }
      }
    },
    { $unwind: { path: '$job_step', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$declined_by', preserveNullAndEmptyArrays: true } }
  ]).exec(callback);
};

postJobs.statics.getPostjobData = function(data, callback) {
  this.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(data.job_id) } },
    {
      $lookup: {
        from: 'saved_jobs',
        localField: '_id',
        foreignField: 'job_id',
        as: 'is_saved'
      }
    },
    {
      $lookup: {
        from: 'job_statuses',
        localField: '_id',
        foreignField: 'job_id',
        as: 'step_data'
      }
    },
    {
      $addFields: {
        is_saved: {
          $map: {
            input: {
              $filter: {
                input: '$is_saved',
                as: 'tmp',
                cond: {
                  $eq: ['$$tmp.user_id', data.user_id]
                }
              }
            },
            as: 'user',
            in: '$$user.job_id'
          }
        },
        job_step: {
          $map: {
            input: {
              $filter: {
                input: '$step_data',
                as: 'tmp',
                cond: {
                  $eq: ['$$tmp.user_id', data.user_id]
                }
              }
            },
            as: 'st',
            in: '$$st.status'
          }
        },
        current_highest_job_step: {
          $max: '$step_data.status'
        }
      }
    },
    { $unwind: { path: '$job_step', preserveNullAndEmptyArrays: true } }
  ]).exec(callback);
};

postJobs.statics.getApplicants = function(data, callback) {
  this.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(data.job_id) } },
    {
      $lookup: {
        from: 'job_statuses',
        localField: '_id',
        foreignField: 'job_id',
        as: 'applicants_id'
      }
    },
    {
      $addFields: {
        applicants_id: {
          $map: {
            input: {
              $filter: {
                input: '$applicants_id',
                as: 'tmp',
                cond: {
                  $eq: ['$$tmp.status', data.step]
                }
              }
            },
            as: 'user',
            in: '$$user.user_id'
          }
        }
      }
    }
  ]).exec(callback);
};

postJobs.statics.getApplicantsWithDeclined = function(data, callback) {
  this.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(data.job_id) } },
    {
      $lookup: {
        from: 'job_statuses',
        localField: '_id',
        foreignField: 'job_id',
        as: 'applicants_id'
      }
    },
    {
      $addFields: {
        declined_applicants_id: {
          $map: {
            input: {
              $filter: {
                input: '$applicants_id',
                as: 'tmp',
                cond: {
                  $lt: ['$$tmp.status', 0]
                }
              }
            },
            as: 'user',
            in: '$$user.user_id'
          }
        },
        declined_applicants: {
          $map: {
            input: {
              $filter: {
                input: '$applicants_id',
                as: 'tmp',
                cond: {
                  $lt: ['$$tmp.status', 0]
                }
              }
            },
            as: 'user',
            in: '$$user'
          }
        },
        applicants_id: {
          $map: {
            input: {
              $filter: {
                input: '$applicants_id',
                as: 'tmp',
                cond: {
                  $eq: ['$$tmp.status', constant['JOB_STEPS']['APPLIED']]
                }
              }
            },
            as: 'user',
            in: '$$user.user_id'
          }
        }
      }
    }
  ]).exec(callback);
};

module.exports = mongoose.model('post_jobs', postJobs);
