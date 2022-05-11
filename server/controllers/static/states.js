var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
stateModel = rfr('/server/models/static/states');

function get(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  stateModel.get(req, res, cb);
}

module.exports = { get }
