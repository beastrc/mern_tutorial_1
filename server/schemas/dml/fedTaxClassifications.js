var rfr = require('rfr'),
mongoose = require('mongoose'),
fedTaxClassifications = mongoose.model('fed_tax_classifications');

var fedTaxClassificationsModel = rfr('/server/models/static/fedTaxClassifications');

fedTaxClassifications.count().exec(function(err, res) {
  if (res === 0) {
    fedTaxClassifications.insertMany([
      {'name': 'Individual/sole proprietor or single-member LLC'},
      {'name': 'Limited liability company'},
      {'name': 'C Corporation'},
      {'name': 'S Corporation'},
      {'name': 'Partnership'},
      {'name': 'Trust/estate'},
      {'name': 'Other'}
    ], function(err, res) {
      fedTaxClassificationsModel.get();
    });
  } else {
    fedTaxClassificationsModel.get();
  }
});
