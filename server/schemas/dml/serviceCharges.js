var rfr = require('rfr'),
mongoose = require('mongoose'),
serviceCharges = mongoose.model('service_charges');

var serviceChargeModel = rfr('/server/models/static/serviceCharge');

serviceCharges.count().exec(function(err, res) {
  if (res === 0) {
    serviceCharges.insertMany([
      {'service_charge': 15}
    ], function() {
      serviceChargeModel.get();
    });
  } else {
    serviceChargeModel.get();
  }
});
