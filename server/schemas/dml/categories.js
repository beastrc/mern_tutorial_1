var rfr = require('rfr'),
mongoose = require('mongoose'),
categories = mongoose.model('categories');

var categoryModel = rfr('/server/models/static/categories');

categories.count().exec(function(err, res) {
  if (res === 0) {
    categories.insertMany([
      {'name': 'Attorneys'},
      {'name': 'Paralegals'},
      {'name': 'Legal Assistants'},
      {'name': 'Legal Secretaries'},
      {'name': 'Stenographers'},
      {'name': 'Court Reporters'},
      {'name': 'Expert Witnesses'},
      {'name': 'File Clerks'}
    ], function(err, res) {
      categoryModel.get();
    });
  } else {
    categoryModel.get();
  }
});
