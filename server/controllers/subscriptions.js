var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
subscriptionsModel = rfr('/server/models/subscriptions')

function getSubscribedPlan(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  subscriptionsModel.getSubscribedPlan(req, res, cb);
}

function createCheckoutSession(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  subscriptionsModel.createCheckoutSession(req, res, cb);
}

function createSubscription(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  subscriptionsModel.createSubscription(req, res, cb);
}

function cancelSubscription(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  subscriptionsModel.cancelSubscription(req, res, cb);
}

module.exports = {
  getSubscribedPlan,
  createCheckoutSession,
  createSubscription,
  cancelSubscription
}
