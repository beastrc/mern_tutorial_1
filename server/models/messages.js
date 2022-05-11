const mongoose = require('mongoose');
var rfr = require('rfr');

var messageSchema = rfr('/server/schemas/ddl/messages');

var constant = rfr('/server/shared/constant'),
  utils = rfr('/server/shared/utils');

var helper = rfr('/server/models/shared/helper');

const getMessages = (req, res) => {
  const { chatroom, last, amount = 20 } = req.query;
  if (!chatroom)
    return res.status(400).json({ error: 'Chatroom unspecified!' });
  if (last) {
    return messageSchema
      .find({ chatroom, timestamp: { $lt: last } })
      .sort({ timestamp: 'asc' })
      .limit(amount)
      .then(messages => {
        if (!messages) return res.json({ info: 'No more messages found' });
        return res.json(messages);
      });
  }
  return messageSchema
    .find({ chatroom })
    .sort({ timestamp: 'asc' })
    .then(messages => {
      if (!messages) return res.json({ info: 'No messages found' });
      return res.json(messages);
    });
};

const deleteMessage = (req, res) => {
  messageSchema.deleteOne({ _id: req.params.id }, err => {
    err ? res.status(500).json(err) : res.json({ success: 'Message deleted' });
  });
};

const postMessage = (req, res) => {
  var cb = function(result) {
    utils.sendResponse(res, result);
  };
  console.log('post message called');
  var resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req.headers.token, function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      var message = req.body;
      delete message.id;
      const newMessage = new messageSchema(message);
      return newMessage.save().then(message => {
        resObj = Object.assign({}, utils.getSuccessResObj());
        resObj['data'] = {
          message: message
        };
        utils.callCB(cb, resObj);
      });
    }
  });
};

module.exports = {
  getMessages,
  deleteMessage,
  postMessage
};
