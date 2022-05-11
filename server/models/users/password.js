'use strict';

var rfr = require('rfr'),
Guid = require('guid'),
mongoose = require('mongoose'),
users = mongoose.model('users'),
logged_in_users = mongoose.model('logged_in_users');

var config = rfr('/server/shared/config'),
constant = rfr('/server/shared/constant'),
helper = rfr('/server/models/shared/helper'),
mailHelper = rfr('/server/shared/mailHelper'),
logger = rfr('/server/shared/logger'),
utils = rfr('/server/shared/utils');

var validator = rfr('/server/models/shared/validator');

/**
   * @method forgotPass
   * @used Sent reset password link to user.
   * @param object req, object res.
   * @return object res.
   * @author KTI0591
*/
function forgotPass(req, res, callback) {
  let reqBody = req.body;

  utils.writeInsideFunctionLog('password', 'forgotPass', reqBody);

  if(!!reqBody.email) {
    reqBody.email = reqBody.email.trim();
    users.findOneQuery({email: reqBody.email} , function(err, result) {
      if(result) {
        var data = {
          user_id: result['_id'],
          forgot_pass: {
            token: Guid.create().value,
            created_at: utils.getCurrentDate()()
          }
        }

        users.updateForgotToken(data, function(Error, Result) {
          if (!Error) {
            let mailObj = {
              firstName: result.first_name.trim(),
              lastName: result.last_name.trim(),
              forgotPassToken: data.forgot_pass.token
            }
            config.mailOptions.to = reqBody.email; // For dynamic list of recievers
            config.mailOptions.subject = "Reset your Legably Password";
            config.mailOptions.html = mailHelper.getMailTmpl('FORGOT_PASSWORD', mailObj);

            // send mail with defined transport object
            config.transporter.sendMail(config.mailOptions, (error, info) => {
              if (error) {
                callback({Code:400, Status:false, Message:constant['OOPS_ERROR']});
                utils.writeErrorLog('password', 'forgotPass', 'Error while sending email', error, {'email': reqBody.email});
              } else {
                callback({Code:200, Status:true, Message:constant['SENT_RESET_EMAIL']});
              }
            });
          } else {
            callback({Code:400, Status:false, Message:constant['OOPS_ERROR']});
            utils.writeErrorLog('password', 'forgotPass', 'Error while updating user detail', Error, data);
          }
        })
        // setup email data with unicode symbols
      } else {
        callback({Code:401, Status:false, Message:constant['EMAIL_DOESNOT_EXIST']});
        utils.writeErrorLog('password', 'forgotPass', 'Error while getting user detail', err, {email: reqBody.email});
      }
    });
  }else{
    callback({Code:400, Status:false, Message:constant['ENTER_EMAIL']});
  }
}

/**
   * @method checkResetLink
   * @used Check for reset password link expiration.
   * @param object req, object res.
   * @return object res.
   * @author KTI0591
*/
function checkResetLink(req, res, callback) {
  utils.writeInsideFunctionLog('password', 'checkResetLink', req['params']);

  if(!!req.params.secretId){
    users.findOneQuery({"forgot_pass.token": req.params.secretId}, function(err, result) {
      if (err) {
        callback({Code: 400, Status: false, Message: constant['OOPS_ERROR']});
        utils.writeErrorLog('password', 'checkResetLink', 'Error while getting user detail', err, {"forgot_pass.token": req.params.secretId});
      } else {
        if (result) {
          var reqTime = new Date(result.forgot_pass.created_at);
          var expireTime = reqTime.setHours(result.forgot_pass.created_at.getHours()+3);
          if (new Date() < new Date(expireTime)) {
            callback({Code: 200, Status: true, Message: constant['REQUEST_OK']});
          }else{
            callback({Code: 401, Status: false, Message: constant['EXPIRED_LINK']});
          }
        } else {
          callback({Code: 401, Status: false, Message: constant['INVALID_LINK']});
        }
      }
    });
  } else {
    callback({Code:400, Status:false, Message: constant['INVALID_PARAMETER']});
  }
}

/**
   * @method resetPass
   * @used Will update user password after successfully reset.
   * @param object req, object res.
   * @return object res.
   * @author KTI0591
*/
function resetPass(req, res, callback) {
  utils.writeInsideFunctionLog('password', 'resetPass', utils.getParamsObjForLoggerHasPassword(req['body']));

  if (!!req.params.secretId && !!req.body.password && !!req.body.confirm_password){
    users.findOneQuery({"forgot_pass.token": req.params.secretId}, function(err, result) {
      if (err) {
        callback({Code: 400, Status: false, Message: constant['OOPS_ERROR']});
        utils.writeErrorLog('password', 'resetPass', 'Error while getting user detail', err, {"forgot_pass.token": req.params.secretId});
      } else {
        if (result) {
          var reqTime = new Date(result.forgot_pass.created_at);
          var expireTime = reqTime.setHours(result.forgot_pass.created_at.getHours()+3);
          if(new Date() < new Date(expireTime)){
            if(validator.passwordValidation(req.body.password) && validator.passwordValidation(req.body.confirm_password)){
              if(req.body.password == req.body.confirm_password){
                // After all valdiation check, update password into user collection
                users.encryptPassword(req.body.password, function(Err, Password) {
                  if (Password) {
                    users.updatePassword(result['_id'], Password, function(Error, Result) {
                      if (!Error) {
                        var data = {
                          user_id: result['_id'],
                          forgot_pass: {
                            token: '',
                            created_at: null
                          }
                        }
                        users.updateForgotToken(data, function(dbErr, success){
                          if (dbErr) {
                            callback({Code:400, Status:false, Message:constant['OOPS_ERROR']});
                            utils.writeErrorLog('password', 'resetPass', 'Error while updating user detail', dbErr, data);
                          } else {
                            callback({Code:200, Status:true, Message:constant['SUCCESS_RESET_PASS']});
                          }
                        })
                      }else{
                        callback({Code:400, Status:false, Message:constant['OOPS_ERROR']});
                        utils.writeErrorLog('password', 'resetPass', 'Error while updating user detail', Error, {'_id': result['_id']});
                      }
                    })
                  }else{
                    callback({Code:400, Status:false, Message:constant['OOPS_ERROR']});
                    logger.error('[password] | <resetPass> - Error while encrypting password --> ', Err);
                  }
                })
              }else{
                callback({Code:400, Status:false, Message:constant['MISMATCH_PASS_CONFPASS']});
              }
            }else{
              callback({Code:400, Status:false, Message:constant['INVALID_PASS_FORMAT']});
            }
          }else{
            callback({Code:401, Status:false, Message:constant['EXPIRED_LINK']});
          }
        } else {
          callback({Code:401, Status:false, Message:constant['INVALID_LINK']});
        }
      }
    });
  }else{
    callback({Code:400, Status:false, Message:constant['EMPTY_FIELD_ERROR']});
  }
}

/**
   * @method changePassword
   * @used Will update user password after successfully change password.
   * @param object req, object res.
   * @return object res.
   * @author KTI0591
*/

function changePass(req, res, callback) {
  utils.writeInsideFunctionLog('password', 'changePass', utils.getParamsObjForLoggerHasPassword(req['body']));

  var reqBody = req['body'];
  if (!!req['headers']['token'] && !!reqBody['old_password'] && !!reqBody['password'] && !!reqBody['confirm_password']) {
    if (validator.passwordValidation(reqBody['password']) && validator.passwordValidation(reqBody['confirm_password'])) {
      helper.checkUserLoggedIn(req['headers']['token'], function(err, result) {
        if (err) {
          callback({Code: 401, Status: false, Message: err});
        } else {
          users.comparePassword(reqBody['old_password'], result['password'], function(uErr, uRes) {
            if (uErr) {
              callback({Code: 400, Status: false, Message: constant['OOPS_ERROR']});
              utils.writeErrorLog('password', 'changePass', 'Error while comparing password', uErr);
            } else{
              if (uRes) {
                users.encryptPassword(reqBody['password'], function(error, ePass) {
                  if (ePass) {
                    users.updatePassword(result['_id'], ePass, function(Error, Result) {
                      if (Error) {
                        callback({Code: 400, Status: false, Message: constant['OOPS_ERROR']});
                        utils.writeErrorLog('password', 'changePass', 'Error while updating user detail', Error, {'_id': result['_id']});
                      } else {
                        callback({Code: 200, Status: true, Message: constant['SUCCESS_RESET_PASS']});
                      }
                    });
                  } else {
                    callback({Code: 400, Status: false, Message: constant['OOPS_ERROR']});
                    logger.error('[password] | <changePass> - Error while encrypting password --> ', error);
                  }
                });
              } else {
                callback({Code: 400, Status: false, Message: constant['CURRPASS_DOESNOT_EXIST']});
              }
            }
          });
        }
      });
    } else {
      callback({Code: 400, Status: false, Message: constant['INVALID_PASS_FORMAT']});
    }
  } else {
    callback({Code: 400, Status: false, Message: constant['EMPTY_FIELD_ERROR']});
  }
}

module.exports = {
  forgotPass,
  checkResetLink,
  resetPass,
  changePass
}
