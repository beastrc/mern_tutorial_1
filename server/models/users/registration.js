'use strict';

var rfr = require('rfr'),
Guid = require('guid'),
mongoose = require('mongoose'),
users = mongoose.model('users'),
logged_in_users = mongoose.model('logged_in_users');

var config = rfr('/server/shared/config'),
constant = rfr('/server/shared/constant'),
mailHelper = rfr('/server/shared/mailHelper'),
utils = rfr('/server/shared/utils');

var validator = rfr('/server/models/shared/validator'),
session = rfr('/server/models/users/session');

/**
   * @method signupUser
   * @used Save user details
   * @param object req, object res.
   * @return object res.
   * @author KTI0591
*/
function signupUser(req, res, cb) {
  let resObj = Object.assign({}, utils.getErrorResObj()),
  reqBody = req['body'];

  utils.writeInsideFunctionLog('registration', 'signupUser', utils.getParamsObjForLoggerHasPassword(reqBody));

  reqBody['email'] = reqBody['email'].trim();
  reqBody['is_email_verified'] = true;
  if (validator.alphaWithDashOnly(reqBody['first_name']) && validator.maxLength(reqBody['first_name'], 50, true) && validator.alphaWithDashOnly(reqBody['last_name']) && validator.maxLength(reqBody['last_name'], 50, true)) {
    if (validator.emailValidation(reqBody['email'])) {
      if (reqBody['password'] === reqBody['confirm_password']) {
        if (validator.passwordValidation(reqBody['password'])) {
          let guid = Guid.create();
          reqBody['email_verification_code'] = guid;
          users.signupUser(reqBody, function(err, result = []) {
            if (err || result.length === 0 || Object.keys(result).length === 0) {
              if (err['code'] === 11000) {
                resObj['code'] = constant['RES_OBJ']['CODE']['IM_USED']
                resObj['message'] = constant['RES_OBJ']['MSG']['IM_USED'];
              } else {
                utils.writeErrorLog('registration', 'signupUser', 'Error while creating entry in users', (err || result));
              }
            } else {
              resObj = Object.assign({}, utils.getSuccessResObj());
              resObj['data'] = {
                'email': reqBody['email']
              };
              let mailObj = {
                firstName: reqBody['first_name'].trim(),
                lastName: reqBody['last_name'].trim(),
                guid: guid
              }
              mailHelper.sendMailInBackground(reqBody['email'], 'Welcome to Legably', 'EMAIL_VERIFICATION', mailObj);
            }
            utils.callCB(cb, resObj);
          });
        } else {
          resObj['message'] = constant['INVALID_PASS_FORMAT'];
          utils.callCB(cb, resObj);
        }
      } else {
        resObj['message'] = constant['MISMATCH_PASS_CONFPASS'];
        utils.callCB(cb, resObj);
      }
    }
    else {
      resObj['message'] = constant['INVALID_EMAIL_FORMAT'];
      utils.callCB(cb, resObj);
    }
  } else {
    resObj['message'] = constant['INVALID_FORMAT'];
    utils.callCB(cb, resObj);
  }
}

function resendEmail(req, res, cb) {
  utils.writeInsideFunctionLog('registration', 'resendEmail', req['params']);

  let resObj = Object.assign({}, utils.getErrorResObj()),
  emailId = req['params']['email'];
  if (emailId) {
    let dbQueryParams = {
      'query': {'email': emailId},
      'data': {'email_verification_code': Guid.create()}
    };
    users.findOneAndUpdateQuery(dbQueryParams, function(uErr, uRes) {
      if (uErr) {
        utils.callCB(cb, resObj);
        utils.writeErrorLog('registration', 'resendEmail', 'Error while updating user detail', uErr, dbQueryParams['query']);
      } else if (uRes === null) {
        resObj['code'] = constant['RES_OBJ']['CODE']['NOT_FOUND'];
        resObj['message'] = constant['RES_OBJ']['MSG']['NOT_FOUND'];
        utils.callCB(cb, resObj);
      } else {
        let mailObj = {
          firstName: uRes['first_name'].trim(),
          lastName: uRes['last_name'].trim(),
          guid: uRes['email_verification_code']
        }
        mailHelper.sendMailInBackground(emailId, 'Welcome to Legably', 'EMAIL_VERIFICATION', mailObj, function(err, res) {
          if (err) {
            utils.callCB(cb, resObj);
            utils.writeErrorLog('registration', 'resendEmail', 'Error while sending email', err);
          } else {
            resObj = Object.assign({}, utils.getSuccessResObj());
            utils.callCB(cb, resObj);
          }
        });
      }
    });
  } else {
    resObj['message'] = constant['INVALID_PARAMETER'];
    utils.callCB(cb, resObj);
  }
}

function verifyEmail(req, res, cb) {
  utils.writeInsideFunctionLog('registration', 'verifyEmail', req['params']);

  let resObj = Object.assign({}, utils.getErrorResObj()),
  secretId = req['params']['secretId'];
  if (secretId) {
    users.findOneQuery({'email_verification_code': secretId}, function(uErr, uRes) {
      if (uErr) {
        utils.callCB(cb, resObj);
        utils.writeErrorLog('registration', 'verifyEmail', 'Error while getting user detail', uErr, {'email_verification_code': secretId});
      } else if (uRes === null) {
        resObj['message'] = constant['INVALID_LINK'];
        utils.callCB(cb, resObj);
      } else {
        let updatedData = {
          'email_verification_code': '',
          'is_email_verified': true,
          'updated_at': utils.getCurrentDate()()
        }
        users.updateProfile(uRes['_id'], updatedData, function(err, result) {
          if (!!result) {
            var userData = session.returnUserData(result);
            logged_in_users.saveData({user_id: userData['id'], token: userData['token']}, function(lErr, lRes) {
              if (lErr) {
                utils.writeErrorLog('registration', 'verifyEmail', 'Error while creating entery in logged in users', lErr);
              } else {
                resObj = Object.assign({'data': userData}, utils.getSuccessResObj());
              }
              utils.callCB(cb, resObj);
            });
          } else {
            utils.callCB(cb, resObj);
            utils.writeErrorLog('registration', 'verifyEmail', 'Error while updating user detail', (err || result));
          }
        })

      }
    });
  } else {
    resObj['message'] = constant['INVALID_PARAMETER'];
    utils.callCB(cb, resObj);
  }
}

module.exports = {
  signupUser,
  resendEmail,
  verifyEmail
}
