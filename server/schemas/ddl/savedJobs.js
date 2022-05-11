'use strict';
//import dependency
var rfr = require('rfr'),
constant = rfr('/server/shared/constant'),
utils = rfr('/server/shared/utils'),
mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = mongoose.Schema.Types.ObjectId;

var savedJobs = new Schema({
  user_id: {type: ObjectId},
  job_id: {type: ObjectId},
  created_at: {type: Date, default: utils.getCurrentDate()},
  updated_at: {type: Date, default: utils.getCurrentDate()}
});

savedJobs.statics.getCount = function(query, callback){
  this.find(query || {}).count().exec(callback);
}

savedJobs.statics.fetchAll = function(data, callback) {
  this.aggregate([
    { "$match" : { "user_id" :  mongoose.Types.ObjectId(data.user_id) } },
    { "$sort": {"_id": -1} },
    { "$limit": data.skip + data.limit },
    { "$skip": data.skip },
    {
      "$lookup": {
        "from": "post_jobs",
        "localField": "job_id",
        "foreignField": "_id",
        "as": "job_details"
      }
    }
  ]).exec(callback);
}

savedJobs.statics.updateSavedJob = function(key, dataObj, callback) {
  var _that = this;
  _that.find(dataObj).count().exec(function(err, data){
    if(!err){
      switch(key){
        case "save": if(data > 0){ callback(true, constant['SAVED_ERROR']); }
                     else{ _that.create(dataObj, callback); }
                     break;
        case "unsave": if(data == 0){ callback(true, constant['UNSAVED_ERROR']); }
                     else{ _that.remove(dataObj, callback); }
                     break;
      }
    }else{
      callback(err,data);
    }
  })
}

module.exports = mongoose.model('saved_jobs', savedJobs);
