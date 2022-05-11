var rfr = require('rfr'),
mongoose = require('mongoose'),
paymentTypes = mongoose.model('payment_types');

var paymentTypeModel = rfr('/server/models/static/paymentTypes');

paymentTypes.count().exec(function(err, res) {
  if (res === 0) {
    paymentTypes.insertMany([
      {'name': 'Milestone'},
      {'name': 'Hourly Rate/Fixed Fee'}
    ], function(err, res) {
      paymentTypeModel.get();
    });
  } else {
    paymentTypeModel.get();
  }
});
