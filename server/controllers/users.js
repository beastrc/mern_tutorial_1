var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
sessionModel = rfr('/server/models/users/session'),
registrationModel = rfr('/server/models/users/registration'),
passwordModel = rfr('/server/models/users/password'),
profileModel = rfr('/server/models/users/profile');

function login(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  sessionModel.login(req, res, cb);
}

function logout(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  sessionModel.logout(req, res, cb);
}

function signup(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  registrationModel.signupUser(req, res, cb);
}

function forgotPassword(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  passwordModel.forgotPass(req, res, cb);
}

function checkResetLink(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  passwordModel.checkResetLink(req, res, cb);
}

function resetPassword(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  passwordModel.resetPass(req, res, cb);
}

function changePassword(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  passwordModel.changePass(req, res, cb);
}

function getUserProfile(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  profileModel.getUserProfile(req, res, cb);
}

function basicProfile(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  profileModel.basicProfile(req, res, cb);
}

function experienceProfile(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  profileModel.experienceProfile(req, res, cb);
}

function networkProfile(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  profileModel.networkProfile(req, res, cb);
}

function jobProfile(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  profileModel.jobProfile(req, res, cb);
}

function posterBasicProfile(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  profileModel.posterBasicProfile(req, res, cb);
}

function resendEmail(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  registrationModel.resendEmail(req, res, cb);
}

function verifyEmail(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  registrationModel.verifyEmail(req, res, cb);
}

function getCandidatesData(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }

  profileModel.getCandidatesData(req, res, cb)
}

module.exports = {
  login,
  logout,
  signup,
  forgotPassword,
  checkResetLink,
  resetPassword,
  changePassword,
  getUserProfile,
  basicProfile,
  experienceProfile,
  networkProfile,
  jobProfile,
  posterBasicProfile,
  resendEmail,
  verifyEmail,
  getCandidatesData
}
