var rfr = require('rfr'),
mongoose = require('mongoose'),
degrees = mongoose.model('degrees');

var degreeModel = rfr('/server/models/static/degrees');

degrees.count().exec(function(err, res) {
  if (res === 0) {
    degrees.insertMany([
      {'name': 'Bachelor of Arts'},
      {'name': 'Bachelor of Science'},
      {'name': 'Master'},
      {'name': 'Juris Doctor'},
      {'name': 'Doctorate'},
      {'name': 'Other'}
    ], function(err, res) {
      degreeModel.get();
    });
  } else {
    degreeModel.get();
  }
});
