'use strict';

var rfr = require('rfr'),
mongoose = require('mongoose'),
users = mongoose.model('users'),
logged_in_users = mongoose.model('logged_in_users'),
post_jobs = mongoose.model('post_jobs');

var constant = rfr('/server/shared/constant'),
logger = rfr('/server/shared/logger'),
utils = rfr('/server/shared/utils');

/**
   * @method _barStateIdToArr
   * @used for collaborating state license id to multiselect location array
   * @param object result, string forUser, string fromUser, string key.
   * @return function callback.
   * @author KTI0591
*/
function _barStateIdToArr(result, forUser, fromUser, profileType, key, callback) {
  for(var i = 0; i < result[fromUser].basic_profile.bar_admission.length; i++) {
    result[forUser][profileType][key][i] = result[fromUser].basic_profile.bar_admission[i].bar_state_id;
  }

  if(i == result[fromUser].basic_profile.bar_admission.length) {
    callback(result);
  }
}

/**
   * @method checkUserLoggedIn
   * @used for user authentication
   * @param object data, function callback.
   * @return function callback.
   * @author KTI0591
*/
function checkUserLoggedIn(data, callback) {
  logged_in_users.findOneQuery({token: data}, function(err, result) {
    if (err) {
      callback(constant['OOPS_ERROR']);
      utils.writeErrorLog('helper', 'checkUserLoggedIn', 'Error while getting logged in user detail', err, {'token': data});
    } else {
      if (result) {
        users.findOneQuery({_id: result.user_id}, function(uErr, uRes) {
          if (uErr) {
            callback(constant['OOPS_ERROR']);
            utils.writeErrorLog('helper', 'checkUserLoggedIn', 'Error while getting user detail', uErr, {'_id': result.user_id});
          } else {
            if (uRes) {
              if (uRes.role === 'user' && uRes.status != constant['STATUS']['ACTIVE']) {
                callback(constant['AUTH_FAIL']);
              } else{
                callback(null, uRes);
              }
            } else {
              callback(constant['AUTH_FAIL']);
            }
          }
        })
      } else {
        callback(constant['AUTH_FAIL']);
      }
    }
  });
}

/**
   * @method checkBasicInfo
   * @used for getting prefilled information for user while creating his profile, if user had completed his other profile earlier.
   * @param object result, string forUser, string fromUser, function callback.
   * @return function callback.
   * @author KTI0591
*/
function checkBasicInfo(result, forUser, fromUser, callback) {
  if (!result[forUser].basic_profile.basic_info.street_address && !!result[fromUser].basic_profile.basic_info.street_address){
    result[forUser].basic_profile.basic_info = result[fromUser].basic_profile.basic_info;
    if (result[forUser].basic_profile.practice_area_id.length == 0 && result[fromUser].basic_profile.practice_area_id.length > 0){
      result[forUser].basic_profile.practice_area_id = result[fromUser].basic_profile.practice_area_id;
    }
    if (forUser == 'job_seeker_info') {
      if (result[forUser].basic_profile.bar_admission.length == 0 && result[fromUser].basic_profile.practice_location_id.length > 0){
        // result[forUser].basic_profile.bar_admission[] = result[fromUser].basic_profile.practice_location_id.length;
        for(var i=0; i < result[fromUser].basic_profile.practice_location_id.length; i++){
          result[forUser].basic_profile.bar_admission.push({"bar_state_id": result[fromUser].basic_profile.practice_location_id[i]});
        }
        if(i==result[fromUser].basic_profile.practice_location_id.length){
          callback(result);
        }
      }else{
        callback(result);
      }
    }else{
      if(result[forUser].basic_profile.practice_location_id.length == 0 && result[fromUser].basic_profile.bar_admission.length > 0){
        _barStateIdToArr(result , forUser, fromUser,'basic_profile','practice_location_id',callback)
      }else{
        callback(result);
      }
    }
  }else{
    if(forUser == 'job_seeker_info' && result[forUser].is_profile_completed == 'N'){
      if(result[forUser].basic_profile.bar_admission.length > 0 && result[forUser].job_profile.willing_to_work_location_id.length == 0){
        _barStateIdToArr(result , forUser, forUser, 'job_profile', 'willing_to_work_location_id',callback);
      } else{
        callback(result);
      }
    }else{
      callback(result);
    }
  }
}

// function isUserAccountOnPayoneer(userId, cb) {
//   let dbQueryParams = {
//     'query': {'user_id': userId}
//   };

//   utils.writeInsideFunctionLog('helper', 'isUserAccountOnPayoneer', dbQueryParams['query']);

//   payoneer_accounts.findQuery(dbQueryParams, function(pErr, pRes) {
//     if (pErr) {
//       utils.writeErrorLog('helper', 'isUserAccountOnPayoneer', 'Error while getting user account detail on payoneer', pErr, dbQueryParams['query']);
//     }
//     cb(!!pRes && !!pRes.length && !!pRes[0]['payoneer_account_id']);
//   });
// }

function updatePostJobInProgressStep(jobId) {
  utils.writeInsideFunctionLog('helper', 'updatePostJobInProgressStep', {'jobId': jobId});

  let updatedData = {
    'inProgressStep': true
  };
  post_jobs.updateQuery(jobId, updatedData, function(pErr, pRes) {
    if (utils.isObjectNotEmpty(pRes)) {
      logger.info('[helper]', 'Post job inProgressStep updated to true successfully');
    } else {
      utils.writeErrorLog('helper', 'updatePostJobInProgressStep', 'Error while updating post job inProgressStep to true', (pErr || pRes), {'_id': jobId});
    }
  });
}

module.exports = {
  checkUserLoggedIn,
  checkBasicInfo,
  // isUserAccountOnPayoneer,
  updatePostJobInProgressStep
}
