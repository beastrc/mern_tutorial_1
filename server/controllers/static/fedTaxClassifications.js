var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
fedTaxClassificationsModel = rfr('/server/models/static/fedTaxClassifications');

function get(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  fedTaxClassificationsModel.get(req, res, cb);
}

module.exports = { get }
