var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
degreeModel = rfr('/server/models/static/degrees');

function get(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  degreeModel.get(req, res, cb);
}

module.exports = { get }
