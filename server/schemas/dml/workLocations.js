var rfr = require('rfr'),
mongoose = require('mongoose'),
workLocations = mongoose.model('work_locations');

var workLocationModel = rfr('/server/models/static/workLocations');

workLocations.count().exec(function(err, res) {
  if (res === 0) {
    workLocations.insertMany([
      {'name': 'Remote'},
      {'name': 'On-Site'}
    ], function(err, res) {
      workLocationModel.get();
    });
  } else {
    workLocationModel.get();
  }
});
