'use strict';
//import dependency
var rfr = require('rfr'),
  bcrypt = require('bcrypt'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Schema.Types.ObjectId;

var config = rfr('/server/shared/config'),
  constant = rfr('/server/shared/constant'),
  utils = rfr('/server/shared/utils');

//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of your database entries.
var users = new Schema({
  first_name: { type: String, required: true, maxlength: 50 },
  last_name: { type: String, required: true, maxlength: 50 },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  is_bar_id_valid: { type: String, default: 'Yes' },
  is_email_verified: { type: Boolean, default: false },
  email_verification_code: { type: String, default: '' },
  freeze_activity: { type: Boolean, default: false },
  job_seeker_info: {
    basic_profile: {
      basic_info: {
        street_address: { type: String, default: '' },
        city: { type: String, default: '' },
        state_id: { type: String, default: '' },
        zipcode: { type: String, default: '' },
        phone_number: { type: String, default: '' },
      },
      education: [
        {
          school: { type: String, default: '' },
          degree_id: { type: String, default: '' },
          degree_others: { type: String, default: '' },
          year: { type: String, default: '' },
          education_additional_information: { type: String, default: '' }
        }
      ],
      bar_admission: [
        {
          bar_state_id: { type: String, default: '' },
          bar_registration_number: { type: String, uppercase: true, default: null }
        }
      ],
      practice_area_id: { type: Array },
      skill_used_id: { type: Array },
      others: { type: String },
      showOthers: { type: String },
      present: { type: String },
      do_you_have_malpractice_insurance: { type: String, default: 'N' }
    },
    experience: [
      {
        company_name: { type: String, default: '' },
        designation: { type: String, default: '' },
        current_employer: { type: String, default: '' },
        start_date: { type: String },
        end_date: { type: String },
        employment_type_id: { type: Array },
        skill_used_id: { type: Array },
        experience_additional_information: { type: String },
        others: { type: String },
        showOthers: { type: String },
        present: { type: String }
      }
    ],
    network: {
      photo: { type: String },
      lawyer_headline: { type: String, default: '' },
      about_lawyer: { type: String, default: '' },
      linkedin_link: { type: String, default: '' },
      resume: { type: String },
      writing_samples: { type: Array },
    },
    job_profile: {
      willing_to_work_locally: { type: String, default: 'Y' },
      willing_to_work_location_id: { type: Array },
      willing_to_work_remotely: { type: String },
      willing_to_work_full_time: { type: String },
      willing_to_work_part_time: { type: String },
      desired_job_type: [
        {
          employment_type_id: { type: String },
          min_amount: { type: Number },
          max_amount: { type: Number },
          selected: { type: String }
        }
      ]
    },
    is_profile_completed: { type: String, default: 'N' },
    last_visited_page: { type: Number, default: 0 }
  },
  job_posters_info: {
    basic_profile: {
      basic_info: {
        street_address: { type: String, default: '' },
        city: { type: String, default: '' },
        state_id: { type: String, default: '' },
        zipcode: { type: String, default: '' },
        phone_number: { type: String, default: '' },
      },
      firm_name: { type: String },
      title: { type: String },
      practice_location_id: { type: Array },
      practice_area_id: { type: Array },
      intrested_in_id: { type: Array },
      website_url: { type: String },
      bar_admission: [
        {
          bar_state_id: { type: String, default: '' },
          bar_registration_number: { type: String, uppercase: true, default: null }
        }
      ],
    },
    is_profile_completed: { type: String, default: 'N' },
    last_visited_page: { type: Number, default: 0 },
  },
  last_visited_profile: { type: String, default: "job_seeker_info" },
  forgot_pass: {
    token: { type: String },
    created_at: { type: Date, default: null }
  },
  role: { type: String, default: 'user' },
  status: { type: Number, default: constant['STATUS']['ACTIVE'] },
  created_at: { type: Date, default: utils.getCurrentDate() },
  updated_at: { type: Date, default: utils.getCurrentDate() }
});

users.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, config.saltRounds, function (err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

users.statics.signupUser = function (data, callback) {
  this.create(data, callback);
};

users.statics.findOneQuery = function (query, callback) {
  this.findOne(query, callback);
};

users.statics.findQuery = function (queryObj = {}, callback) {
  this.find(queryObj.query || {}, queryObj.options || {}).sort(queryObj.sortOption || {}).exec(callback);
};

users.statics.encryptPassword = function (password, callback) {
  bcrypt.hash(password, config.saltRounds, function (err, hash) {
    if (err) return callback(err);
    callback(null, hash);
  });
};

users.statics.comparePassword = function (pass, encryptPass, callback) {
  bcrypt.compare(pass, encryptPass, function (err, res) {
    callback(err, res);
  });
};

users.statics.updatePassword = function (user_id, password, callback) {
  this.findOneAndUpdate({ _id: user_id }, { $set: { password: password } }, { upsert: false }, callback);
};

users.statics.findProfile = function (user_id, key, nestedKey, data, step, callback) {
  this.findOne({ _id: user_id }, { _id: 0 }, function (err, result) {
    if (err) {
      callback(err);
    } else {
      result[key]['last_visited_page'] = step;
      if ((key == 'job_seeker_info' && step === 4) || (key == 'job_posters_info' && step === 1)) {
        result[key]['is_profile_completed'] = 'Y';
      }
      result['last_visited_profile'] = key;
      result[key][nestedKey] = data;
      callback(null, result);
    }
  });
};

users.statics.updateProfile = function (user_id, data, callback) {
  this.findOneAndUpdate({ _id: user_id }, { $set: data }, { upsert: false }, callback);
};

users.statics.updateForgotToken = function (data, callback) {
  this.findOneAndUpdate({ _id: data.user_id }, { $set: { "forgot_pass": data.forgot_pass } }, { upsert: false }, callback);
};

users.statics.findOneAndUpdateQuery = function (queryObj = {}, callback) {
  this.findOneAndUpdate(queryObj.query || {}, { $set: queryObj.data }, { new: true, upsert: false }, callback);
};

//export our module to use in user.js
module.exports = mongoose.model('users', users);
