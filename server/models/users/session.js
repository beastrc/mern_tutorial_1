var rfr = require('rfr'),
Guid = require('guid'),
mongoose = require('mongoose'),
users = mongoose.model('users'),
logged_in_users = mongoose.model('logged_in_users');

var constant = rfr('/server/shared/constant'),
utils = rfr('/server/shared/utils');

function returnUserData(result) {
  utils.writeInsideFunctionLog('session', 'returnUserData');

  return {
    id: result['_id'],
    first_name: result['first_name'],
    last_name: result['last_name'],
    email: result['email'],
    image: result['job_seeker_info']['network']['photo'],
    is_seeker_profile_completed: result['job_seeker_info']['is_profile_completed'] === 'Y',
    is_poster_profile_completed: result['job_posters_info']['is_profile_completed'] === 'Y',
    role: result['role'],
    is_bar_id_valid: result['is_bar_id_valid'],
    status: result['status'],
    token: Guid.create().value,
    freeze_activity: result['freeze_activity']
  };
}

const login = (req, res, cb) => {
  utils.writeInsideFunctionLog('session', 'login', utils.getParamsObjForLoggerHasPassword(req['body']));

  var email = req.body.email.trim(),
  password = req.body.password.trim(),
  constResObj = constant['RES_OBJ'],
  resObj = Object.assign({}, utils.getErrorResObj());

  if (email && password) {
    let dbQueryParams = {
      'email': email
    };
    users.findOneQuery(dbQueryParams, function(err, result) {
      if (err) {
        utils.callCB(cb, resObj);
        utils.writeErrorLog('session', 'login', 'Error while getting user detail', err, dbQueryParams);
      } else {
        if (utils.isObjectNotEmpty(result)) {
          users.comparePassword(password, result['password'], function(uErr, uRes) {
            if (uErr) {
              utils.callCB(cb, resObj);
              utils.writeErrorLog('session', 'login', 'Error while comparing password', uErr);
            } else {
              if (uRes) {
                var userData = returnUserData(result);
                if (userData['status'] !== constant['STATUS']['ACTIVE']) {
                  resObj['message'] = constant['INACTIVE_STATUS'];
                  utils.callCB(cb, resObj);
                } else if (userData['role'] === 'admin') {
                  resObj['code'] = constResObj['CODE']['UNAUTHORIZED'];
                  resObj['message'] = constResObj['MSG']['UNAUTHORIZED'];
                  utils.callCB(cb, resObj);
                } else if (result['is_email_verified'] === false) {
                  resObj['code'] = constResObj['CODE']['LOCKED'];
                  resObj['message'] = constResObj['MSG']['LOCKED'];
                  utils.callCB(cb, resObj);
                } else {
                  logged_in_users.saveData({user_id: userData['id'], token: userData['token']}, function(err, result) {
                    if (err) {
                      utils.writeErrorLog('session', 'login', 'Error while creating entry in logged in users', err);
                    } else {
                      resObj = Object.assign({'data': userData}, utils.getSuccessResObj());
                    }
                    utils.callCB(cb, resObj);
                  });
                }
              } else {
                resObj['code'] = constResObj['CODE']['UNAUTHORIZED'];
                resObj['message'] = constResObj['MSG']['UNAUTHORIZED'];
                utils.callCB(cb, resObj);
              }
            }
          });
        } else {
          resObj['code'] = constResObj['CODE']['UNAUTHORIZED'];
          resObj['message'] = constResObj['MSG']['UNAUTHORIZED'];
          utils.callCB(cb, resObj);
        }
      }
    });
  } else {
    resObj['message'] = constant['EMAIL_PASS_ERROR'];
    utils.callCB(cb, resObj);
  }
}

const logout = (req, res, callback) => {
  utils.writeInsideFunctionLog('session', 'logout', req['body']);

  var token = req.headers.token,
  constResObj = constant['RES_OBJ'],
  resObj = Object.assign({}, utils.getErrorResObj());

  if (token) {
    logged_in_users.findOneQuery({token: token}, function(err, result) {
      if (err) {
        callback(resObj);
        utils.writeErrorLog('session', 'logout', 'Error while getting logged in user detail', err, {token: token});
      } else {
        if (utils.isObjectNotEmpty(result)) {
          logged_in_users.removeEntry(result._id, function(err, result) {
            if (err) {
              utils.writeErrorLog('session', 'logout', 'Error while deleting entry from logged in users', err, {'_id': result._id});
            } else {
              resObj = Object.assign({}, utils.getSuccessResObj());
            }
            callback(resObj);
          });
        } else {
          callback(resObj);
        }
      }
    });
  } else {
    resObj['code'] = constResObj['CODE']['UNAUTHORIZED'];
    resObj['message'] = constResObj['MSG']['UNAUTHORIZED'];
    callback(resObj);
  }
}

module.exports = {
  returnUserData,
  login,
  logout
}
