var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
  jobStatusModel = rfr('/server/models/jobStatus');

function updateJobStatus(req, res) {
  var cb = function (result) {
    utils.sendResponse(res, result);
  }
  jobStatusModel.updateJobStatus(req, res, cb);
}

//Added by zhu 10/01/20
//Function to get the one job_status with user_id and job_id

function getOneJobStatus(req, res) {
  var cb = function (result) {
    utils.sendResponse(res, result);
  }
  jobStatusModel.getOneJobStatus(req, res, cb);
}

function getAll(req, res) {
  var cb = function (result) {
    utils.sendResponse(res, result);
  }
  jobStatusModel.getAll(req, res, cb);
}

function saveRating(req, res) {
  var cb = function (result) {
    utils.sendResponse(res, result);
  }
  jobStatusModel.saveRating(req, res, cb);
}

module.exports = {
  updateJobStatus,
  getOneJobStatus,
  getAll,
  saveRating
}
