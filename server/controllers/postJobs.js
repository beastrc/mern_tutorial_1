var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
  postJobModel = rfr('/server/models/postJobs');

function postJobData(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  };
  postJobModel.postJobData(req, res, cb);
}

function getPostJobData(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  };
  postJobModel.getPostJobData(req, res, cb);
}

function getAll(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  };
  postJobModel.getAllPostJobs(req, res, cb);
}

function getPostJobDetails(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  };
  postJobModel.getPostJobDetails(req, res, cb);
}

function getPostJobByUserId(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  };
  postJobModel.getPostJobByUserId(req, res, cb);
}

function getInvitablePostJobs(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  };
  postJobModel.getInvitablePostJobs(req, res, cb);
}

function getStepData(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  };
  postJobModel.getStepData(req, res, cb);
}

function updatePostedJobStatus(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  };
  postJobModel.updateStatus(req, res, cb);
}

module.exports = {
  postJobData,
  getPostJobData,
  getAll,
  getPostJobDetails,
  getPostJobByUserId,
  getInvitablePostJobs,
  getStepData,
  updatePostedJobStatus
};
