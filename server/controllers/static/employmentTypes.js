var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
employmentTypeModel = rfr('/server/models/static/employmentTypes');

function get(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  employmentTypeModel.get(req, res, cb);
}

module.exports = { get }
