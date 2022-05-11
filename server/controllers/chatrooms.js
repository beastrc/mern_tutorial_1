var rfr = require('rfr');
var utils = rfr('/server/shared/utils'),
  chatroomsModel = rfr('/server/models/chatrooms');

function getChatRooms(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  };
  chatroomsModel.getChatRooms(req, res, cb);
}

function postChatRoom(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  };
  chatroomsModel.postChatRoom(req, res, cb);
}

module.exports = {
  getChatRooms,
  postChatRoom
};
