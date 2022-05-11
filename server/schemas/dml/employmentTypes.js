var rfr = require('rfr'),
  mongoose = require('mongoose'),
  employmentTypes = mongoose.model('employment_types');

var employmentTypeModel = rfr('/server/models/static/employmentTypes');

employmentTypes.count().exec(function (err, res) {
  if (res === 0) {
    employmentTypes.insertMany([
      { 'name': 'Part-time' },
      { 'name': 'Full-time' },
      { 'name': 'Permanent' },
      { 'name': 'Contract' }
    ], function (err, res) {
      employmentTypeModel.get();
    });
  } else {
    employmentTypeModel.get();
  }
});
