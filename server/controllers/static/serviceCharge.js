var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
serviceChargeModel = rfr('/server/models/static/serviceCharge');

function get(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  serviceChargeModel.get(req, res, cb);
}

module.exports = { get }
