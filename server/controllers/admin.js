var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
adminModel = rfr('/server/models/admin');

function exportUsers(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  adminModel.exportUsers(req, res, cb);
}

function exportPostJobs(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  adminModel.exportPostJobs(req, res, cb);
}

module.exports = {
  exportUsers,
  exportPostJobs
}
