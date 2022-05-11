const mongoose = require('mongoose');
var rfr = require('rfr');

var jobStatusSchema = rfr('/server/schemas/ddl/jobStatus'),
  postJobSchema = rfr('/server/schemas/ddl/postJobs'),
  nTermsSchema = rfr('/server/schemas/ddl/negotiateTerms'),
  userSchema = rfr('/server/schemas/ddl/users'),
  stripeChargeSchema = rfr('/server/schemas/ddl/stripeCharges');

var constant = rfr('/server/shared/constant'),
  config = rfr('/server/shared/config'),
  logger = rfr('/server/shared/logger'),
  utils = rfr('/server/shared/utils'),
  mailHelper = rfr('/server/shared/mailHelper');

var helper = rfr('/server/models/shared/helper');

var stripe = require("stripe")(config['stripe']['secret_key']);

function getStripeChargeDetails(jobId, cb) {
  utils.writeInsideFunctionLog('jobStatus', 'getStripeChargeDetails', { 'jobId': jobId });

  let dbQueryParams = {
    'query': {
      'job_id': jobId,
      'status': { '$gte': constant['PAYMENT_STATUS']['FUND_TRANSFER_REQUEST_SENT'] }
    }
  };
  stripeChargeSchema.findQuery(dbQueryParams, function (sErr, sRes) {
    if (sErr) {
      utils.writeErrorLog('jobStatus', 'getStripeChargeDetails', 'Error while getting stripe charge detail', sErr, dbQueryParams['query']);
    }
    cb(sErr, sRes);
  });
}

/* Stripe Accounts Model Functions */

function _actionsAfterUpdateJobStatus(dataObj, callback) {
  utils.writeInsideFunctionLog('jobStatus', '_actionsAfterUpdateJobStatus', dataObj);

  switch (dataObj['status']) {
    case 101: _sendAppliedMail(dataObj, callback);
      break;
    case 103: _createNegotiateTerms(dataObj, callback);
      break;
    case -103: _updateNegotitateTermStatus(dataObj, callback);
      break;
    case 104: _sendMailOnAcceptTerms(dataObj, callback);
      break;
    case -104: _updateStripeChargeStatus(dataObj, callback);
      break;
    default: callback(null, true);
  }
}

function _updateTermsStatus(dataObj, status, cb) {
  utils.writeInsideFunctionLog('jobStatus', '_updateTermsStatus', { 'status': status });

  let dbQueryParams = {
    query: {
      'jobId': dataObj['jobId'],
      'seekerId': dataObj['seekerId']
    }
  }
  let updatedData = {
    'status': status,
    'updated_at': utils.getCurrentDate()()
  }
  nTermsSchema.updateQuery(dbQueryParams, updatedData, function (nErr, nRes) {
    if (utils.isObjectNotEmpty(nRes)) {
      cb(null, true);
    } else {
      cb(constant['OOPS_ERROR']);
      utils.writeErrorLog('jobStatus', '_updateTermsStatus', 'Error while updating negotiate terms detail', (nErr || nRes), dbQueryParams['query']);
    }
  });
}

function _sendAppliedMail(dataObj, cb) {
  utils.writeInsideFunctionLog('jobStatus', '_sendAppliedMail');

  getJobDetail(dataObj['jobId'], function (pErr, pResult) {
    if (!!pResult && pResult.length) {

      let posterQuery = {
        'query': { '_id': pResult[0].userId }
      }

      userSchema.findQuery(posterQuery, function (uErr, uRes) {
        if (!!uRes && uRes.length) {

          let seekerMailObj = {
            seekerName: dataObj['first_name'],
            jobName: utils.toTitleCase(pResult[0]['jobHeadline'])
          }

          let posterMailObj = {
            posterName: uRes[0]['first_name'],
            seekerName: `${dataObj['first_name']} ${dataObj['last_name']}`,
            jobName: utils.toTitleCase(pResult[0]['jobHeadline'])
          }

          mailHelper.sendMailInBackground(dataObj['seekerEmail'], 'Job Application Sent', 'JOB_APPLIED', seekerMailObj);
          mailHelper.sendMailInBackground(uRes[0]['email'], 'Candidate Applied To Job', 'CANDIDATE_COMPLETED', posterMailObj);
        }
      })
    }
  });

  cb(null, true);
}

function _createNegotiateTerms(dataObj, cb) {
  utils.writeInsideFunctionLog('jobStatus', '_createNegotiateTerms');

  getJobDetail(dataObj['jobId'], function (pErr, pResult) {
    if (pErr) {
      cb(constant['OOPS_ERROR']);
    } else {
      if (!!pResult.length && pResult.length) {
        let postJobResult = pResult[0];
        var nTermData = {
          seekerId: dataObj['seekerId'],
          jobId: dataObj['jobId'],
          posterId: dataObj['posterId'],
          rate: postJobResult['rate'],
          rateType: postJobResult['rateType'],
          hours: postJobResult['hours'],
          hoursType: postJobResult['hoursType'],
          subTotal: postJobResult['subTotal'],
          total: postJobResult['total'],
          currentRate: postJobResult['currentRate'],
          paymentDetails: postJobResult['paymentDetails'],
        }
        nTermsSchema.saveData(nTermData, function (sErr, sRes) {
          if (sErr) {
            cb(constant['OOPS_ERROR']);
            utils.writeErrorLog('jobStatus', '_createNegotiateTerms', 'Error while creating entry in negotiate terms', sErr, nTermData);
          } else {
            cb(null, sRes);
          }
        });
      } else {
        cb(constant['NO_RECORD_FOUND']);
      }
    }
  });
}

function _updateNegotitateTermStatus(dataObj, cb) {
  utils.writeInsideFunctionLog('jobStatus', '_updateNegotitateTermStatus');

  let dbQueryParams = {
    query: {
      'jobId': dataObj['jobId'],
      'seekerId': dataObj['seekerId']
    }
  }
  if (dataObj['role'] === constant['ROLE']['SEEKER']) {
    let status = (dataObj['status'] === (constant['JOB_STEPS']['N_TERMS'] * -1)) ? constant['N_TERMS_STATUS']['DECLINED_BY_SEEKER_BEFORE_ACCEPTED'] : constant['N_TERMS_STATUS']['DECLINED_BY_SEEKER_AFTER_ACCEPTED'];
    _updateTermsStatus(dataObj, status, cb);
  } else {
    nTermsSchema.findQuery(dbQueryParams, function (nErr, nRes) {
      if (!!nRes && nRes.length) {
        let status = (nRes[0]['status'] === 0) ? constant['N_TERMS_STATUS']['DECLINED_BY_POSTER_BEFORE_SENT'] : constant['N_TERMS_STATUS']['DECLINED_BY_POSTER_AFTER_SENT'];
        _updateTermsStatus(dataObj, status, cb);
      } else {
        cb(constant['OOPS_ERROR']);
        utils.writeErrorLog('jobStatus', '_updateNegotitateTermStatus', 'Error while getting negotiate terms detail', (nErr || nRes), dbQueryParams['query']);
      }
    });
  }
}

function _sendMailOnAcceptTerms(dataObj, cb) {
  utils.writeInsideFunctionLog('jobStatus', '_sendMailOnAcceptTerms');

  _updateTermsStatus(dataObj, constant['N_TERMS_STATUS']['ACCEPTED'], cb);
  getJobDetail(dataObj['jobId'], function (pErr, pResult) {
    if (!!pResult && pResult.length) {
      let dbQueryParams = {
        'query': { '_id': pResult[0]['userId'] }
      };
      userSchema.findQuery(dbQueryParams, function (uErr, uRes) {
        if (!!uRes && uRes.length) {
          let mailObj = {
            seekerName: dataObj['first_name'],
            posterName: uRes[0]['first_name'],
            jobName: utils.toTitleCase(pResult[0]['jobHeadline'])
          };
          mailHelper.sendMailInBackground(uRes[0]['email'], 'Job Terms Accepted By Candidate', 'JOB_TERMS_ACCEPTED_FOR_POSTER', mailObj);
          mailHelper.sendMailInBackground(dataObj['seekerEmail'], 'Job Terms Accepted', 'JOB_TERMS_ACCEPTED_FOR_SEEKER', mailObj);
        } else {
          utils.writeErrorLog('jobStatus', '_sendMailOnAcceptTerms', 'Error while getting user detail', (uErr || uRes), dbQueryParams['query']);
        }
      });
    }
  });
}

function _updateStripeChargeStatus(dataObj, cb) {
  utils.writeInsideFunctionLog('jobStatus', '_updateStripeChargeStatus');

  let dbQueryParams = {
    'query': { 'job_id': dataObj['jobId'], 'status': { '$gte': constant['PAYMENT_STATUS']['FUND_TRANSFER_REQUEST_SENT'] } },
    'data': { 'status': constant['PAYMENT_STATUS']['CANCELLED'] }
  };
  stripeChargeSchema.updateQuery(dbQueryParams, function (oErr, oRes) {
    if (oErr) {
      cb(constant['OOPS_ERROR']);
      utils.writeErrorLog('jobStatus', '_updateStripeChargeStatus', 'Error while updating stripe charge', (oErr || oRes), dbQueryParams['query']);
    } else {
      _updateNegotitateTermStatus(dataObj, function (nErr, nRes) {
        cb(nErr, nRes);
      });
    }
  });
}

function _cancelOrder(updateDataObj, result, cb) {
  utils.writeInsideFunctionLog('jobStatus', '_cancelOrder', updateDataObj);

  let resObj = Object.assign({}, utils.getErrorResObj());
  getStripeChargeDetails(updateDataObj['dbQueryParams']['job_id'], function (pErr, pRes) {
    if (pErr) {
      utils.callCB(cb, resObj);
    } else {
      if (!!pRes && pRes.length > 0) {
        stripe.refunds.create({
          charge: pRes[0]['stripe_charge_id']
        }).then(function (refund) {
          _updateJobStatusAfterAllChecks(updateDataObj, result, cb, true);
        }, function (stripeErr) {
          resObj['code'] = constant['RES_OBJ']['CODE']['FAILED_DEPENDENCY'];
          resObj['message'] = utils.getStripeErrorMsg(stripeErr);
          utils.callCB(cb, resObj);
          utils.writeErrorLog('jobStatus', '_cancelOrder', 'Error while creating refund charge request on stripe', stripeErr, { 'charge': pRes[0]['stripe_charge_id'] });
        });
      } else {
        _updateJobStatusAfterAllChecks(updateDataObj, result, cb, true);
      }
    }
  });
}

function _updateJobStatusAfterAllChecks(updateDataObj, result, cb, fromCancelOrder = false) {
  utils.writeInsideFunctionLog('jobStatus', '_updateJobStatusAfterAllChecks');

  if (updateDataObj['dbQueryParams']['status'] === (constant['JOB_STEPS']['S_PENDING'] * -1) && !fromCancelOrder) {
    _cancelOrder(updateDataObj, result, cb);
  } else {
    let resObj = Object.assign({}, utils.getErrorResObj());
    jobStatusSchema.updateQuery(updateDataObj['dbQueryParams'], function (uErr, uRes) {
      if (uErr) {
        utils.callCB(cb, resObj);
        utils.writeErrorLog('jobStatus', '_updateJobStatusAfterAllChecks', 'Error while updating job status detail', uErr, updateDataObj['dbQueryParams']);
      } else {
        let dataObj = {
          jobId: updateDataObj['dbQueryParams']['job_id'],
          seekerId: updateDataObj['dbQueryParams']['user_id'],
          posterId: updateDataObj['posterId'],
          role: updateDataObj['role'],
          status: uRes['status'],
          first_name: result['first_name'],
          last_name: result['last_name'],
          seekerEmail: result['email']
        }
        _actionsAfterUpdateJobStatus(dataObj, function (error, success) {
          if (success) {
            resObj = Object.assign({}, utils.getSuccessResObj());
            resObj['data'] = {
              'status': uRes
            }
            getHighestJobStep(updateDataObj['dbQueryParams']['job_id'], function (highestJobStep) {
              resObj['data']['current_highest_job_step'] = highestJobStep;
              utils.callCB(cb, resObj);
            });
          } else {
            resObj['message'] = error;
            utils.callCB(cb, resObj);
          }
        });
      }
    });
  }
}

function getHighestJobStep(jobId, cb) {
  utils.writeInsideFunctionLog('jobStatus', 'getHighestJobStep', { 'jobId': jobId });

  var dbQueryParams = {
    "job_id": jobId
  };
  postJobSchema.getPostjobData(dbQueryParams, function (pErr, pResult) {
    var current_highest_job_step = constant['JOB_STEPS']['APPLIED'];
    if (!!pResult && pResult.length) {
      current_highest_job_step = pResult[0]['current_highest_job_step'];
    } else {
      utils.writeErrorLog('jobStatus', 'getHighestJobStep', 'Error while getting current highest job step', (pErr || pResult), dbQueryParams);
    }
    utils.callCB(cb, current_highest_job_step);
  });
}

function getJobDetail(jobId, cb) {
  utils.writeInsideFunctionLog('jobStatus', 'getJobDetail', { 'jobId': jobId });

  let dbQueryParams = {
    'query': { '_id': jobId }
  }
  postJobSchema.findQuery(dbQueryParams, function (err, result) {
    if (err || result.length === 0) {
      utils.writeErrorLog('jobStatus', 'getJobDetail', 'Error while getting job detail', (err || result), dbQueryParams['query']);
    }
    cb(err, result);
  });
}

function _afterAllConflictsCheck(updateDataObj, queryObj, result, cb) {
  utils.writeInsideFunctionLog('jobStatus', '_afterAllConflictsCheck', updateDataObj);

  let resObj = Object.assign({}, utils.getErrorResObj());
  let jobId = updateDataObj['dbQueryParams']['job_id'];
  let action = updateDataObj['dbQueryParams']['status'];
  jobStatusSchema.findQuery(queryObj, function (sErr, sRes) {
    if (sErr) {
      utils.callCB(cb, resObj);
      utils.writeErrorLog('jobStatus', '_afterAllConflictsCheck', 'Error while getting job status detail', sErr, queryObj['query']);
    } else {
      if (sRes[0] && sRes[0]['status'] < 0) {
        resObj['code'] = constant['RES_OBJ']['CODE']['CONFLICT'];
        resObj['message'] = constant['RES_OBJ']['MSG']['CONFLICT'];
        utils.callCB(cb, resObj);
      } else {
        let absAction = Math.abs(action);
        if (sRes[0] && (absAction < sRes[0]['status'])) {
          if ((action === (constant['JOB_STEPS']['INTERVIEWING'] * -1)) && sRes[0]['status'] === constant['JOB_STEPS']['N_TERMS']) {
            queryObj['query'] = {
              'jobId': jobId,
              'seekerId': result['_id']
            }
            nTermsSchema.findQuery(queryObj, function (nErr, nRes) {
              if (!!nRes && nRes.length > 0) {
                if (nRes[0]['status'] === constant['N_TERMS_STATUS']['SENT']) {
                  resObj['code'] = constant['RES_OBJ']['CODE']['CONFLICT'];
                  resObj['message'] = constant['RES_OBJ']['MSG']['CONFLICT'];
                  utils.callCB(cb, resObj);
                } else {
                  _updateJobStatusAfterAllChecks(updateDataObj, result, cb);
                }
              } else {
                utils.callCB(cb, resObj);
                utils.writeErrorLog('jobStatus', '_afterAllConflictsCheck', 'Error while getting negotiate terms detail', (nErr || nRes), queryObj['query']);
              }
            });
          } else {
            resObj['code'] = constant['RES_OBJ']['CODE']['CONFLICT'];
            resObj['message'] = constant['RES_OBJ']['MSG']['CONFLICT'];
            utils.callCB(cb, resObj);
          }
        } else {
          _updateJobStatusAfterAllChecks(updateDataObj, result, cb);
        }
      }
    }
  });
}

function updateJobStatus(req, res, cb) {
  utils.writeInsideFunctionLog('jobStatus', 'updateJobStatus', req['body']);

  let resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req.headers.token, function (err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      let reqBody = req['body'],
        jobId = reqBody['job_id'],
        action = reqBody['status'],
        posterId = null,
        role = 'seeker';
      let dbQueryParams = {
        "user_id": result['_id'],
        "job_id": jobId,
        "status": action
      };
      let queryObj = {
        'query': {
          "user_id": result['_id'],
          "job_id": jobId
        }
      };
      if (reqBody['user_id']) {
        role = 'poster';
        posterId = result['_id'];
        dbQueryParams['user_id'] = reqBody['user_id'];
        queryObj.query['user_id'] = reqBody['user_id'];
      }
      dbQueryParams['declined_by'] = (action < 0) ? role : '';

      let updateDataObj = {
        dbQueryParams: dbQueryParams,
        posterId: posterId,
        role: role
      }
      let userQueryParams = {
        'query': { '_id': dbQueryParams['user_id'] }
      };
      userSchema.findQuery(userQueryParams, function (uErr, uRes) {
        if (!!uRes && uRes.length) {
          let isBarIdValid = uRes[0]['is_bar_id_valid'];
          let freezeActivity = uRes[0]['freeze_activity'];

          if (role === 'seeker' && action === constant['JOB_STEPS']['APPLIED'] &&
            (isBarIdValid.toLowerCase() !== reqBody['is_bar_id_valid'].toLowerCase())) {
            resObj['code'] = constant['RES_OBJ']['CODE']['CONFLICT'];
            resObj['message'] = constant['RES_OBJ']['MSG']['CONFLICT'];
            utils.callCB(cb, resObj);
          } else if (freezeActivity !== reqBody['freeze_activity']) {
            resObj['code'] = constant['RES_OBJ']['CODE']['CONFLICT'];
            resObj['message'] = constant['RES_OBJ']['MSG']['CONFLICT'];
            utils.callCB(cb, resObj);
          } else if (freezeActivity) {
            resObj['code'] = constant['RES_OBJ']['CODE']['LOCKED'];
            resObj['message'] = constant['RES_OBJ']['MSG']['LOCKED'];
            utils.callCB(cb, resObj);
          } else if ((isBarIdValid.toLowerCase() === 'yes' && role === 'seeker') || (role === 'poster' && !freezeActivity) || (isBarIdValid.toLowerCase() === 'no' && role === 'seeker' && !freezeActivity && action !== constant['JOB_STEPS']['APPLIED'])) {
            if (reqBody['user_id'] && action === constant['JOB_STEPS']['N_TERMS']) {
              let queryParam = {
                'query': {
                  'job_id': jobId,
                  'status': { '$gte': constant['JOB_STEPS']['N_TERMS'] }
                }
              }
              jobStatusSchema.findQuery(queryParam, function (jErr, jRes) {
                if (jErr) {
                  utils.callCB(cb, resObj);
                  utils.writeErrorLog('jobStatus', 'updateJobStatus', 'Error while getting job status detail', jErr, queryParam['query']);
                } else if (!!jRes && jRes.length) {
                  resObj['code'] = constant['RES_OBJ']['CODE']['UNPROCESSABLE'];
                  resObj['message'] = constant['RES_OBJ']['MSG']['UNPROCESSABLE'];
                  utils.callCB(cb, resObj);
                } else {
                  _afterAllConflictsCheck(updateDataObj, queryObj, result, cb);
                }
              })
            } else {
              _afterAllConflictsCheck(updateDataObj, queryObj, result, cb);
            }
          } else {
            resObj['code'] = constant['RES_OBJ']['CODE']['INVALID_BAR_ID'];
            resObj['message'] = constant['INVALID_BAR_ID'];
            utils.callCB(cb, resObj);
          }
        } else {
          utils.writeErrorLog('jobStatus', 'updateJobStatus', 'Error while getting user detail', (uErr || uRes), userQueryParams['query']);
        }
      })
    }
  });
}

function getOneJobStatus(req, res, cb) {
  utils.writeInsideFunctionLog('jobStatus', 'getOneJobStatus', req['body']);

  var resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req.headers.token, function (err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {

      var dbQueryParams = {
        query: {
          'user_id': mongoose.Types.ObjectId(req.params.userId),
          'job_id': mongoose.Types.ObjectId(req.params.jobId),
        }
      };
      console.log(dbQueryParams);
      jobStatusSchema.findQuery(dbQueryParams, function (cErr, cResult) {
        if (cErr) {
          utils.callCB(cb, cErr);
          utils.writeErrorLog('jobStatus', 'getOneJobStatus', 'Error while getting job status', cErr, dbQueryParams);
        } else {
          console.log(cResult);
          resObj = Object.assign({}, utils.getSuccessResObj());
          resObj['data'] = {
            'job_status': cResult[0],
          }
          utils.callCB(cb, resObj);
        }
      })
    }
  })
}

function getAll(req, res, cb) {
  utils.writeInsideFunctionLog('jobStatus', 'getAll', req['params']);

  var resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req.headers.token, function (err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      var perPage = 10, page = Math.max(0, req.params.page - 1)
      var dbQueryParams = {
        "user_id": result._id,
        "skip": perPage * page,
        "limit": Number(perPage)
      };
      jobStatusSchema.getCount({ "user_id": result._id }, function (cErr, cResult) {
        if (cErr) {
          utils.callCB(cb, resObj);
          utils.writeErrorLog('jobStatus', 'getAll', 'Error while getting job count', cErr, dbQueryParams);
        } else {
          if (cResult > 0) {
            let userObj = {
              'freeze_activity': result.freeze_activity,
              'isBarIdValid': result.is_bar_id_valid
            };
            jobStatusSchema.fetchAll(dbQueryParams, function (pErr, pResult) {
              if (pErr) {
                utils.writeErrorLog('jobStatus', 'getAll', 'Error while getting user and job detail', pErr, dbQueryParams);
              } else {
                var obj = { "count": cResult, "data": pResult };
                resObj = Object.assign({}, utils.getSuccessResObj());
                resObj['data'] = {
                  'count': cResult,
                  'jobs': pResult,
                  'userData': userObj
                }
              }
              utils.callCB(cb, resObj);
            })
          } else {
            resObj['message'] = constant['NO_RECORD_FOUND'];
            utils.callCB(cb, resObj);
          }
        }
      })
    }
  })
}

function updateRatingByRole(ratingUpdateQuery, resObj, cb) {
  console.log('updatingObject;', ratingUpdateQuery);

  jobStatusSchema.updateQuery(ratingUpdateQuery, function (jErr, jRes) {
    if (jErr) {
      utils.callCB(cb, jErr);
      utils.writeErrorLog('jobStatus', 'saveRating', 'Error while saving job rating', jErr, ratingUpdateQuery);
    } else {
      resObj = Object.assign({}, utils.getSuccessResObj());
      resObj['data'] = {
        'status': jRes
      }

      utils.callCB(cb, resObj);
    }
  })
}

function saveRating(req, res, cb) {
  let resObj = Object.assign({}, utils.getErrorResObj());
  utils.writeInsideFunctionLog('jobStatus', 'saveRating', req['body']);

  helper.checkUserLoggedIn(req.headers.token, function (err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      const { role, rating, jobId } = req['body']
      const ratingUpdateQuery = {
        job_id: jobId,
        status: constant['JOB_STEPS']['J_COMPLETE'],
      }
      const ratingName = role === 'seeker' ? 'rating_poster' : 'rating_seeker'
      ratingUpdateQuery[ratingName] = rating
      const userQueryObj = {
        job_id: jobId
      }

      if (role === 'seeker') {
        ratingUpdateQuery['user_id'] = result._id;
        updateRatingByRole(ratingUpdateQuery, resObj, cb)
      } else {
        jobStatusSchema.findQuery(userQueryObj, function (e, result) {
          if (e) {
            utils.callCB(cb, jErr);
            utils.writeErrorLog('jobStatus', 'saveRating', 'Error while saving job rating', jErr, ratingUpdateQuery);
          } else {
            ratingUpdateQuery['user_id'] = result[0].user_id;
            updateRatingByRole(ratingUpdateQuery, resObj, cb)
          }
        })
      }
    }
  })
}

module.exports = {
  getStripeChargeDetails,
  getHighestJobStep,
  getJobDetail,
  updateJobStatus,
  getOneJobStatus,
  getAll,
  saveRating,
  _sendAppliedMail
}
