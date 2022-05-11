var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
workLocationModel = rfr('/server/models/static/workLocations');

function get(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  workLocationModel.get(req, res, cb);
}

module.exports = { get }
