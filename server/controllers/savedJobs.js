var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
savedJobsModel = rfr('/server/models/savedJobs');

function get(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  savedJobsModel.get(req, res, cb);
}

function updateSavedJob(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  savedJobsModel.updateSavedJob(req, res, cb);
}

module.exports = { 
	get,
	updateSavedJob
}