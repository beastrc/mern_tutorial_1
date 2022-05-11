var rfr = require('rfr'),
mongoose = require('mongoose'),
jobTypes = mongoose.model('job_types');

var jobTypeModel = rfr('/server/models/static/jobTypes');

jobTypes.count().exec(function(err, res) {
  if (res === 0) {
    jobTypes.insertMany([
      {'name': '1099'}
    ], function(err, res) {
      jobTypeModel.get();
    });
  } else {
    jobTypeModel.get();
  }
});
