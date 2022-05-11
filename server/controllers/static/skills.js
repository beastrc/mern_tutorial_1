var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
skillModel = rfr('/server/models/static/skills');

function get(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  skillModel.get(req, res, cb);
}

module.exports = { get }
