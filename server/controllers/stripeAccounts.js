var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
stripeAccModel = rfr('/server/models/stripeAccounts'),
negotiateTermsModel = rfr('/server/models/negotiateTerms');

function setStripeAccountInfo(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  stripeAccModel.setStripeAccountInfo(req, res, cb);
}

function transferFunds(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  stripeAccModel.transferFunds(req, res, cb);
}

function getReleaseFundUrl(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  stripeAccModel.getReleaseFundUrl(req, res, cb);
}

function getSetPreferencesStatus(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  stripeAccModel.getSetPreferencesStatus(req, res, cb);
}

function webhook(req, res) {
  stripeAccModel.webhook(req, res);
}

function getStripeDashboardLink(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  stripeAccModel.getStripeDashboardLink(req, res, cb);
}

function getCreateStripeAccountLink(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  stripeAccModel.getCreateStripeAccountLink(req, res, cb);
}

function realeaseFund(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  stripeAccModel.realeaseFund(req, res, cb);
}

module.exports = {
  setStripeAccountInfo,
  transferFunds,
  getReleaseFundUrl,
  getSetPreferencesStatus,
  webhook,
  getStripeDashboardLink,
  getCreateStripeAccountLink,
  realeaseFund
}
