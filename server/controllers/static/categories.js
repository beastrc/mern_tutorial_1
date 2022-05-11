var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
categoryModel = rfr('/server/models/static/categories');

function get(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  categoryModel.get(req, res, cb);
}

module.exports = { get }
