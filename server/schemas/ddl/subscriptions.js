'use strict';
//import dependency
var rfr = require('rfr'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Schema.Types.ObjectId;

var subscriptions = new Schema({
  user_id: { type: ObjectId },
  subscription_type: { type: Number, default: 1 },
  subscription_id: { type: String },
  status: { type: String },
  plan_id: { type: String },
  projects: { type: Array },
  signup_at: { type: Number },
  updated_at: { type: Number },
  renewed_at: { type: Number },
  canceled_at: { type: Number },
  canceled_reason: { type: String }
});

module.exports = mongoose.model('subscriptions', subscriptions);
