var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
negotiateTermsModel = rfr('/server/models/negotiateTerms');

function update(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  negotiateTermsModel.update(req, res, cb);
}

function updateDeliverableStatus(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  negotiateTermsModel.updateDeliverableStatus(req, res, cb);
}

function downloadDeliverableFile(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  negotiateTermsModel.downloadDeliverableFile(req, res, cb);
}

function updateHourlyFixedTerms(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  negotiateTermsModel.updateHourlyFixedTerms(req, res, cb);
}

module.exports = {
  update,
  updateDeliverableStatus,
  updateHourlyFixedTerms,
  downloadDeliverableFile
}
