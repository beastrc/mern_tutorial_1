var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
practiceAreaModel = rfr('/server/models/static/practiceAreas');

function get(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  practiceAreaModel.get(req, res, cb);
}

module.exports = { get }
