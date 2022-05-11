var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
universalModel = rfr('/server/models/universal');

function contactUs(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  universalModel.contactUs(req, res, cb);
}

function getAllListsData(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  universalModel.getAllListsData(req, res, cb);
}

function sendMsg(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  universalModel.sendMsg(req, res, cb);
}

function getLogFile(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  universalModel.getLogFile(req, res, cb);
}

module.exports = {
  contactUs,
  getAllListsData,
  sendMsg,
  getLogFile
}
