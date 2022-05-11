var rfr = require('rfr');
var utils = rfr('/server/shared/utils'),
  messagesModel = rfr('/server/models/messages');

function getMessages(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  };
  messagesModel.getMessages(req, res, cb);
}

function postMessage(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  };
  messagesModel.postMessage(req, res, cb);
}

module.exports = {
  getMessages,
  postMessage
};
