'use strict';

let rfr = require('rfr'),
  moment = require('moment'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  ObjectId = mongoose.Types.ObjectId,
  users = mongoose.model('users'),
  employment_types = mongoose.model('employment_types'),
  post_jobs = mongoose.model('post_jobs'),
  job_status = mongoose.model('job_status');

let config = rfr('/server/shared/config'),
  constant = rfr('/server/shared/constant'),
  mailHelper = rfr('/server/shared/mailHelper'),
  utils = rfr('/server/shared/utils');

let nTermsSchema = rfr('/server/schemas/ddl/negotiateTerms'),
  stripeAccountsSchema = rfr('/server/schemas/ddl/stripeAccounts');

let helper = rfr('/server/models/shared/helper'),
  validator = rfr('/server/models/shared/validator'),
  negotiateTermsModel = rfr('/server/models/negotiateTerms'),
  wNineInfoModel = rfr('/server/models/wNineInfo');

function _sendMailOnPostJob(userDataObj, jobDataObj) {
  let mailObj = {
    posterName: userDataObj['first_name'],
    jobName: `${utils.toTitleCase(jobDataObj['jobHeadline'])}`
  };

  utils.writeInsideFunctionLog('postJobs', '_sendMailOnPostJob', mailObj);

  mailHelper.sendMailInBackground(
    userDataObj['email'],
    'Job Posted',
    'JOB_POSTED',
    mailObj
  );
}

function _postJobSaveData(req, res, userData, callback) {
  utils.writeInsideFunctionLog('postJobs', '_postJobSaveData', {
    _id: req['body']['_id'] || null
  });

  if (!req.body._id) {
    if (req.body.status === constant['STATUS']['INACTIVE']) {
      req.body.posted_at = null;
    }
    post_jobs.saveData(req['body'], function(err, resp) {
      if (err) {
        callback({ Code: 400, Status: false, Message: constant['OOPS_ERROR'] });
        utils.writeErrorLog(
          'postJobs',
          '_postJobSaveData',
          'Error while creating entry in post job',
          err,
          req['body']
        );
      } else {
        if (req.body.status === constant['STATUS']['ACTIVE']) {
          _sendMailOnPostJob(userData, req['body']);
        }
        callback({
          Code: 200,
          Status: true,
          Message: constant['SUCCESS_POST_JOB']
        });
      }
    });
  } else {
    let id = req.body._id;
    delete req.body._id;
    req.body.updated_at = utils.getCurrentDate()();
    post_jobs.updateQuery(id, req.body, function(err, resp) {
      if (err) {
        callback({ Code: 400, Status: false, Message: constant['OOPS_ERROR'] });
        utils.writeErrorLog(
          'postJobs',
          '_postJobSaveData',
          'Error while updating job detail',
          err,
          { _id: id }
        );
      } else {
        let dbQueryParams = {
          query: { jobId: id, status: constant['N_TERMS_STATUS']['NOT_SENT'] }
        };
        delete req['body']['status'];
        nTermsSchema.updateQuery(dbQueryParams, req['body'], function(
          nErr,
          nRes
        ) {
          if (nErr) {
            callback({
              Code: 400,
              Status: false,
              Message: constant['OOPS_ERROR']
            });
            utils.writeErrorLog(
              'postJobs',
              '_postJobSaveData',
              'Error while updating negotiate terms detail',
              nErr,
              dbQueryParams['query']
            );
          } else {
            callback({
              Code: 200,
              Status: true,
              Message: constant['SUCCESS_POST_JOB']
            });
          }
        });
      }
    });
  }
}

function _savePostJob(req, res, userData, callback) {
  utils.writeInsideFunctionLog('postJobs', '_savePostJob');

  employment_types.findJobType(req.body.hoursType, function(error, response) {
    if (error) {
      callback({ Code: 400, Status: false, Message: constant['OOPS_ERROR'] });
      utils.writeErrorLog(
        'postJobs',
        '_savePostJob',
        'Error while getting employment types detail',
        error,
        { _id: req.body.hoursType }
      );
    } else if (response) {
      if (response.name == 'Part-time' || response.name == 'Full-time') {
        if (req.body.rateType == 'HOURLY') {
          var subtotalAmt = Number(req.body.rate * req.body.hours).toFixed(2);
        } else {
          var subtotalAmt = Number(req.body.rate).toFixed(2);
        }
        if (Number(req.body.subTotal).toFixed(2) == subtotalAmt) {
          let total =
            Number(subtotalAmt) +
            Number((subtotalAmt * req.body.currentRate) / 100);
          if (Number(req.body.total).toFixed(2) == Number(total).toFixed(2)) {
            if (
              req.body.paymentDetails.length > 0 &&
              !(
                req.body.jobType == '1099' &&
                req.body.paymentType == 'Hourly Rate/Fixed Fee'
              )
            ) {
              let count = 0;
              for (let i = 0; i < req.body.paymentDetails.length; i++) {
                if (
                  req.body.paymentDetails[i].rate == 0 &&
                  !req.body.paymentDetails[i].delivery &&
                  !req.body.paymentDetails[i].dueDate
                ) {
                  req.body.paymentDetails.splice(i, 1);
                  i--;
                } else if (
                  req.body.paymentDetails[i].dueDate &&
                  !req.body._id
                ) {
                  if (
                    moment(req.body.paymentDetails[i].dueDate).isSameOrAfter(
                      utils.getCurrentEstDate()
                    )
                  ) {
                    count++;
                  } else {
                    callback({
                      Code: 400,
                      Status: false,
                      Message: constant['INVALID_DUE_DATE']
                    });
                  }
                } else {
                  count++;
                }
              }
              if (count == req.body.paymentDetails.length) {
                _postJobSaveData(req, res, userData, callback);
              }
            } else {
              _postJobSaveData(req, res, userData, callback);
            }
          } else {
            callback({
              Code: 400,
              Status: false,
              Message: constant['TOTAL_AMT_ERROR']
            });
          }
        } else {
          callback({
            Code: 400,
            Status: false,
            Message: constant['SUBTOTAL_ERROR']
          });
        }
      } else {
        callback({
          Code: 404,
          Status: false,
          Message: constant['INVALID_HOUR_TYPE_ID']
        });
      }
    } else {
      callback({
        Code: 404,
        Status: false,
        Message: constant['INVALID_HOUR_TYPE_ID']
      });
    }
  });
}

function _getStepData(stepDataObj, callback) {
  utils.writeInsideFunctionLog('postJobs', '_getStepData', {
    userId: stepDataObj['userId'],
    userRole: stepDataObj['userRole'],
    jobId: stepDataObj['jobId'],
    step: stepDataObj['step']
  });

  if (stepDataObj['userRole'] === constant['ROLE']['SEEKER']) {
    switch (stepDataObj['step']) {
      case -101:
      case 101:
        _getAppliedDate(stepDataObj, callback);
        break;
      case -102:
      case -104:
        _getDeclinedBy(stepDataObj, callback);
        break;
      case -103:
        _getDeclinedByWithTermsStatus(stepDataObj, callback);
        break;
      case 103:
        negotiateTermsModel.get(stepDataObj, callback);
        break;
      case 104:
        _getWNineAndSetPreferenceDetails(stepDataObj, callback);
        break;
      case 105:
        _getInProgressDetails(stepDataObj, callback);
        break;
      default:
        callback(null, []);
    }
  } else {
    let absStep =
      stepDataObj['step'] < 0
        ? constant['JOB_STEPS']['APPLIED']
        : stepDataObj['step'];
    switch (absStep) {
      case 101:
        _getApplicantListWithDeclinedCandidates(stepDataObj, callback);
        break;
      case 102:
        _getApplicantList(stepDataObj, callback);
        break;
      case 103:
        negotiateTermsModel.get(stepDataObj, callback);
        break;
      case 104:
        _getStartPendingDetails(stepDataObj, callback);
        break;
      case 105:
        _getInProgressDetails(stepDataObj, callback);
        break;
      default:
        callback(null, []);
    }
  }
}

function _getAppliedDate(stepDataObj, callback) {
  utils.writeInsideFunctionLog('postJobs', '_getAppliedDate');

  let queryObj = {
    query: { job_id: stepDataObj['jobId'], user_id: stepDataObj['userId'] },
    options: { created_at: 1, _id: 0 }
  };
  job_status.findQuery(queryObj, function(err, res) {
    if (!!res && res.length) {
      res[0]['_doc']['created_at'] = utils
        .convertUtcToEst(res[0]['created_at'])
        .format();
      callback(null, res);
    } else {
      callback(constant['OOPS_ERROR']);
      utils.writeErrorLog(
        'postJobs',
        '_getAppliedDate',
        'Error while getting job status detail',
        err || res,
        queryObj['query']
      );
    }
  });
}

function _getDeclinedBy(stepDataObj, callback) {
  utils.writeInsideFunctionLog('postJobs', '_getDeclinedBy');

  let dbQueryParams = {
    query: { job_id: stepDataObj['jobId'], user_id: stepDataObj['userId'] },
    options: { _id: 0, declined_by: 1 }
  };
  job_status.findQuery(dbQueryParams, function(err, res) {
    if (!!res && res.length) {
      let result = [];
      result.push({ declined_by: res[0]['declined_by'] });
      callback(null, result);
    } else {
      callback(err);
      utils.writeErrorLog(
        'postJobs',
        '_getDeclinedBy',
        'Error while getting job status detail',
        err || res,
        dbQueryParams['query']
      );
    }
  });
}

function _getDeclinedByWithTermsStatus(stepDataObj, callback) {
  utils.writeInsideFunctionLog('postJobs', '_getDeclinedByWithTermsStatus');

  _getDeclinedBy(stepDataObj, function(error, result) {
    if (error) {
      callback(error);
    } else {
      let dbQueryParams = {
        query: { jobId: stepDataObj['jobId'], seekerId: stepDataObj['userId'] },
        options: { _id: 0, status: 1 }
      };
      nTermsSchema.findQuery(dbQueryParams, function(err, res) {
        if (!!res && res.length) {
          result[0]['status'] = res[0]['status'];
          callback(null, result);
        } else {
          callback(err);
          utils.writeErrorLog(
            'postJobs',
            '_getDeclinedByWithTermsStatus',
            'Error while getting negotiate terms detail',
            err || res,
            dbQueryParams['query']
          );
        }
      });
    }
  });
}

function _getWNineAndSetPreferenceDetails(stepDataObj, cb) {
  utils.writeInsideFunctionLog('postJobs', '_getWNineAndSetPreferenceDetails');

  wNineInfoModel.get(stepDataObj, function(err, res) {
    if (err) {
      cb(err);
    } else {
      res[0]['stripe_account_status'] =
        constant['STRIPE_ACCOUNT_STATUS']['NOT_CREATED'];
      stripeAccountsSchema.findAccountDetails(stepDataObj, function(
        sErr,
        sRes
      ) {
        if (sErr) {
          callback(constant['OOPS_ERROR']);
          utils.writeErrorLog(
            'postJobs',
            '_getWNineAndSetPreferenceDetails',
            'Error while getting stripe account detail',
            sErr || sRes,
            stepDataObj['userId']
          );
        } else {
          let accountDetails = sRes[0];
          accountDetails &&
            (res[0]['stripe_account_status'] = accountDetails['status']);
          cb(null, res);
        }
      });
    }
  });
}

function _maintainOrder(arr, arrOfObj) {
  let temp = [];
  for (let i = 0, len = arrOfObj.length; i < len; i++) {
    let index = arr.indexOf(arrOfObj[i]._id.toString());
    temp[index] = arrOfObj[i];
  }
  return temp;
}

function _convertObjectIdsArrToString(arr) {
  for (let i = 0, len = arr.length; i < len; i++) {
    arr[i] = arr[i].toString();
  }
}

function _getApplicantListWithDeclinedCandidates(stepDataObj, callback) {
  utils.writeInsideFunctionLog(
    'postJobs',
    '_getApplicantListWithDeclinedCandidates'
  );

  let dbQueryParams = {
    job_id: stepDataObj['jobId'],
    step: stepDataObj['step']
  };
  post_jobs.getApplicantsWithDeclined(dbQueryParams, function(pErr, pRes) {
    if (!!pRes && pRes.length) {
      let pResult = pRes[0];
      let queryObj = {
        query: { _id: { $in: pResult['applicants_id'] } }
      };
      users.findQuery(queryObj, function(uErr, uRes) {
        if (uErr) {
          callback(constant['OOPS_ERROR']);
          utils.writeErrorLog(
            'postJobs',
            '_getApplicantListWithDeclinedCandidates',
            'Error while getting user detail',
            uErr,
            queryObj['query']
          );
        } else {
          let declinedApplicantsIdArr = pResult['declined_applicants_id'];
          queryObj['query'] = { _id: { $in: declinedApplicantsIdArr } };
          users.findQuery(queryObj, function(dErr, dRes) {
            if (dErr) {
              callback(constant['OOPS_ERROR']);
              utils.writeErrorLog(
                'postJobs',
                '_getApplicantListWithDeclinedCandidates',
                'Error while getting declined user detail',
                dErr,
                queryObj['query']
              );
            } else {
              _convertObjectIdsArrToString(pResult['applicants_id']);
              uRes = _maintainOrder(pResult['applicants_id'], uRes);

              _convertObjectIdsArrToString(declinedApplicantsIdArr);
              dRes = _maintainOrder(declinedApplicantsIdArr, dRes);

              for (let user of dRes) {
                let index = declinedApplicantsIdArr.indexOf(
                  user['_id'].toString()
                );
                if (index > -1) {
                  let declinedApplicantObj =
                    pResult['declined_applicants'][index];
                  user['_doc']['declined_by'] =
                    declinedApplicantObj['declined_by'];
                  user['_doc']['job_step'] = declinedApplicantObj['status'];
                }
              }
              callback(null, uRes, dRes);
            }
          });
        }
      });
    } else {
      callback(constant['OOPS_ERROR']);
      utils.writeErrorLog(
        'postJobs',
        '_getApplicantListWithDeclinedCandidates',
        'Error while getting job and user detail',
        pErr || pRes,
        dbQueryParams
      );
    }
  });
}

function _getApplicantList(stepDataObj, callback) {
  utils.writeInsideFunctionLog('postJobs', '_getApplicantList');

  let dbQueryParams = {
    job_id: stepDataObj['jobId'],
    step: stepDataObj['step']
  };
  post_jobs.getApplicants(dbQueryParams, function(pErr, pRes) {
    if (!!pRes && pRes.length) {
      let queryObj = {
        query: { _id: { $in: pRes[0]['applicants_id'] } }
      };
      users.findQuery(queryObj, function(uErr, uRes) {
        if (uErr) {
          callback(constant['OOPS_ERROR']);
          utils.writeErrorLog(
            'postJobs',
            '_getApplicantList',
            'Error while getting user detail',
            uErr,
            queryObj['query']
          );
        } else {
          callback(null, uRes);
        }
      });
    } else {
      callback(constant['OOPS_ERROR']);
      utils.writeErrorLog(
        'postJobs',
        '_getApplicantList',
        'Error while getting job and user detail',
        pErr || pRes,
        dbQueryParams
      );
    }
  });
}

function _getStartPendingDetails(stepDataObj, callback) {
  utils.writeInsideFunctionLog('postJobs', '_getStartPendingDetails');

  stripeAccountsSchema.findAccountDetails(stepDataObj, function(sErr, sResult) {
    if (sErr) {
      callback(constant['OOPS_ERROR']);
      utils.writeErrorLog(
        'postJobs',
        '_getStartPendingDetails',
        'Error while getting user stripe account detail',
        sErr,
        stepDataObj
      );
    } else {
      let accountDetails = sResult[0],
        stripe_account_status =
          constant['STRIPE_ACCOUNT_STATUS']['NOT_CREATED'],
        transfer_funds_status =
          constant['PAYMENT_STATUS']['FUND_TRANSFER_REQUEST_NOT_SENT'];
      if (accountDetails) {
        stripe_account_status = accountDetails['status'];
        accountDetails['tranfer_funds'].length > 0 &&
          (transfer_funds_status = accountDetails['tranfer_funds'][0]);
      }
      let queryObj = {
        query: {
          jobId: ObjectId(stepDataObj['jobId']),
          status: constant['N_TERMS_STATUS']['ACCEPTED']
        }
      };
      nTermsSchema.findQuery(queryObj, function(nErr, nRes) {
        if (nErr) {
          callback(constant['OOPS_ERROR']);
          utils.writeErrorLog(
            'postJobs',
            '_getStartPendingDetails',
            'Error while getting negotiate terms detail',
            nErr,
            queryObj
          );
        } else {
          let dataObj = {
            job_id: stepDataObj['jobId'],
            status: stepDataObj['step']
          };
          job_status.findBarIdStatus(dataObj, function(jErr, jRes) {
            if (!!jRes && jRes.length) {
              let data = jRes[0];
              callback(null, [
                {
                  seekerId: data['user_id'],
                  freeze_activity: data['freeze_activity'][0],
                  stripe_account_status: stripe_account_status,
                  transfer_funds_status: transfer_funds_status,
                  amount: nRes[0]['total']
                }
              ]);
            } else {
              callback(constant['OOPS_ERROR']);
              utils.writeErrorLog(
                'postJobs',
                '_getStartPendingDetails',
                'Error while getting user, job and stripe account detail',
                jErr || jRes,
                dataObj
              );
            }
          });
        }
      });
    }
  });
}

function _getInProgressDetails(stepDataObj, callback) {
  utils.writeInsideFunctionLog('postJobs', '_getInProgressDetails');

  let filterObj = stepDataObj['filterObj'] || {},
    limit = filterObj['limit'] || constant['FETCH_DATA_MAX_LIMIT'],
    pageNo = Math.max(0, filterObj['pageNo'] - 1) || 0;

  let data = {
    query: {
      jobId: ObjectId(stepDataObj['jobId']),
      status: { $eq: constant['N_TERMS_STATUS']['ACCEPTED'] }
    },
    sortBy: 'paymentDetails.' + (filterObj['sortBy'] || 'dueDate'),
    sortOrder: filterObj['sortOrder'] || 1,
    skip: limit * pageNo,
    limit: Number(limit),
    deliverableType: filterObj['deliverableType'] || 'pending',
    count: true
  };

  nTermsSchema.getNonPaidDeliverables(data, function(err, res) {
    if (err) {
      callback(constant['OOPS_ERROR']);
      utils.writeErrorLog(
        'postJobs',
        '_getInProgressDetails',
        'Error while getting non paid deliverable detail',
        err,
        data
      );
    } else {
      let milestone_id = res.length ? res[0]['paymentDetails']['_id'] : null;
      nTermsSchema.getDeliverables(data, function(cErr, cData) {
        if (cErr) {
          callback(cErr);
          utils.writeErrorLog(
            'postJobs',
            '_getInProgressDetails',
            'Error while getting deliverables count',
            cErr,
            data
          );
        } else {
          data['count'] = false;
          nTermsSchema.getDeliverables(data, function(nErr, nRes) {
            if (nErr) {
              callback(nErr);
              utils.writeErrorLog(
                'postJobs',
                '_getInProgressDetails',
                'Error while getting deliverables detail',
                nErr,
                data
              );
            } else {
              let result = {
                count: cData.length,
                action_milestone_id: milestone_id,
                data: nRes
              };
              callback(null, result);
            }
          });
        }
      });
    }
  });
}

/**
 * @method postJobData
 * @used for post a job
 * @param object req, object res
 * @return object res
 * @author KTI0591
 */
function postJobData(req, res, callback) {
  utils.writeInsideFunctionLog('postJobs', 'postJobData');

  if (req.headers.token) {
    helper.checkUserLoggedIn(req.headers.token, function(err, result) {
      if (err) {
        callback({ Code: 401, Status: false, Message: err });
      } else {
        req.body.userId = result._id;
        let validateObj = {};
        validateObj = validator.missingParameters(req.body, [
          'jobType',
          'paymentType'
        ]);
        if (validateObj.isValid) {
          if (
            req.body.jobType == '1099' &&
            req.body.paymentType == 'Hourly Rate/Fixed Fee'
          ) {
            var requiredParameters = [
              'jobHeadline',
              'practiceArea',
              'skillsNeeded',
              'jobDescription',
              'state',
              'setting_id',
              'rate',
              'rateType',
              'hoursType'
            ];
            validateObj = validator.missingParameters(
              req.body,
              requiredParameters
            );
          } else {
            var requiredParameters = [
              'jobHeadline',
              'practiceArea',
              'skillsNeeded',
              'jobDescription',
              'state',
              'setting_id',
              'rate',
              'rateType',
              'hoursType',
              'subTotal',
              'total',
              'currentRate'
            ];
            validateObj = validator.missingParameters(
              req.body,
              requiredParameters
            );
          }
          if (validateObj.isValid) {
            if (
              req.body.jobType == '1099' &&
              req.body.paymentType == 'Hourly Rate/Fixed Fee'
            ) {
              _savePostJob(req, res, result, callback);
            } else if (
              validator.maxLength(req.body.jobHeadline, 150, true) &&
              validator.maxLength(req.body.jobDescription, 2000, true) &&
              validator.maxLength(req.body.rate, 6, true) &&
              validator.maxLength(req.body.hours, 3, false)
            ) {
              if (req.body.subTotal >= 100) {
                _savePostJob(req, res, result, callback);
              } else {
                callback({
                  Code: 400,
                  Status: false,
                  Message: constant['MIN_JOB_AMOUNT']
                });
              }
            } else {
              callback({
                Code: 400,
                Status: false,
                Message: constant['INVALID_FORMAT']
              });
            }
          } else {
            callback({
              Code: 400,
              Status: false,
              Message: validateObj.message
            });
          }
        } else {
          callback({ Code: 400, Status: false, Message: validateObj.message });
        }
      }
    });
  } else {
    callback({ Code: 400, Status: false, Message: constant['AUTH_FAIL'] });
  }
}

/**
 * @method getPostJobData
 * @used for post a job
 * @param object req, object res
 * @return object res
 * @author KTI0591
 */
function getPostJobData(req, res, callback) {
  utils.writeInsideFunctionLog('postJobs', 'getPostJobData', req['params']);

  if (req.headers.token) {
    helper.checkUserLoggedIn(req.headers.token, function(err, result) {
      if (err) {
        callback({ Code: 401, Status: false, Message: err });
      } else if (req.params.jobId) {
        post_jobs.getJobData({ _id: req.params.jobId }, function(
          pErr,
          pResult
        ) {
          if (pErr) {
            callback({
              Code: 400,
              Status: false,
              Message: constant['OOPS_ERROR']
            });
            utils.writeErrorLog(
              'postJobs',
              'getPostjobData',
              'Error while getting job detail',
              pErr,
              { _id: req.params.jobId }
            );
          } else if (pResult !== null) {
            callback({
              Code: 200,
              Status: true,
              Message: constant['REQUEST_OK'],
              Data: pResult
            });
          } else {
            callback({
              Code: 404,
              Status: false,
              Message: constant['NO_RECORD_FOUND']
            });
          }
        });
      } else {
        callback({
          Code: 400,
          Status: false,
          Message: constant['INVALID_PARAMETER']
        });
      }
    });
  } else {
    callback({ Code: 400, Status: false, Message: constant['AUTH_FAIL'] });
  }
}

function getAllPostJobs(req, res, callback) {
  utils.writeInsideFunctionLog('postJobs', 'getAllPostJobs', req['params']);
  const reqBody = req['body'];

  if (req.headers.token) {
    helper.checkUserLoggedIn(req.headers.token, function(err, result) {
      if (err) {
        callback({ Code: 401, Status: false, Message: err });
      } else {
        let perPage = 10,
          page = Math.max(0, req.param('page') - 1);
        let dbQueryParams = {
          user_id: result._id,
          skip: perPage * page,
          limit: Number(perPage),
          states: reqBody.states,
          practiceAreas: reqBody.practiceAreas,
          selectedOrder: reqBody.selectedOrder
        };
        let stateObj =
          reqBody.states && reqBody.states.length
            ? { state: { $in: reqBody.states } }
            : {};
        let practiceAreasArray = _.map(reqBody.practiceAreas, 'value');
        let areaObj =
          reqBody.practiceAreas && reqBody.practiceAreas.length
            ? { 'practiceArea.value': { $in: practiceAreasArray } }
            : {};
        let queryObj = {
          query: {
            $and: [
              { userId: { $ne: mongoose.Types.ObjectId(result._id) } },
              { status: constant['STATUS']['ACTIVE'] },
              { inProgressStep: { $ne: true } },
              areaObj,
              stateObj
            ]
          }
        };

        post_jobs.getCount(queryObj, function(cErr, cResult) {
          if (cErr) {
            callback({
              Code: 400,
              Status: false,
              Message: constant['OOPS_ERROR']
            });
            utils.writeErrorLog(
              'postJobs',
              'getAllPostJobs',
              'Error while getting job count',
              cErr,
              queryObj['query']
            );
          } else {
            let userObj = {
              freeze_activity: result.freeze_activity,
              is_bar_id_valid: result.is_bar_id_valid
            };

            if (cResult > 0) {
              post_jobs.getAllJobs(dbQueryParams, function(pErr, pResult) {
                if (pErr) {
                  callback({
                    Code: 400,
                    Status: false,
                    Message: constant['OOPS_ERROR']
                  });
                  utils.writeErrorLog(
                    'postJobs',
                    'getAllPostJobs',
                    'Error while getting all job details',
                    pErr,
                    dbQueryParams
                  );
                } else if (pResult !== null) {
                  let obj = {
                    count: cResult,
                    data: pResult,
                    userData: userObj
                  };
                  callback({
                    Code: 200,
                    Status: true,
                    Message: constant['REQUEST_OK'],
                    Data: obj
                  });
                } else {
                  callback({
                    Code: 404,
                    Status: false,
                    Message: constant['NO_RECORD_FOUND']
                  });
                }
              });
            } else {
              let obj = { count: cResult, data: [], userData: userObj };

              callback({
                Code: 200,
                Status: true,
                Message: constant['REQUEST_OK'],
                Data: obj
              });
            }
          }
        });
      }
    });
  } else {
    callback({ Code: 400, Status: false, Message: constant['AUTH_FAIL'] });
  }
}

function getPostJobDetails(req, res, cb) {
  utils.writeInsideFunctionLog('postJobs', 'getPostJobDetails', req['params']);

  let resObj = Object.assign({}, utils.getErrorResObj());
  if (req.headers.token) {
    helper.checkUserLoggedIn(req.headers.token, function(err, result) {
      if (err) {
        resObj['message'] = constant['AUTH_FAIL'];
        resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
        utils.callCB(cb, resObj);
      } else {
        let jobId = req.params.jobId;
        let dbQueryParams = {
          user_id: result._id,
          job_id: jobId
        };
        post_jobs.getPostjobData(dbQueryParams, function(pErr, pResult) {
          if (pErr) {
            utils.callCB(cb, resObj);
            utils.writeErrorLog(
              'postJobs',
              'getPostJobDetails',
              'Error while getting job details',
              pErr,
              dbQueryParams
            );
          } else if (pResult !== null) {
            let userRole = req.params.userRole;
            if (pResult[0]['current_highest_job_step'] && userRole) {
              let step = pResult[0]['current_highest_job_step'];
              if (userRole === 'seeker') {
                step = pResult[0]['job_step'] ? pResult[0]['job_step'] : 100;
              }
              let stepDataObj = {
                jobId: jobId,
                step: step,
                userId: result._id,
                userRole: req.params.userRole,
                userData: result
              };
              _getStepData(stepDataObj, function(
                error,
                stepData,
                declinedApplicants
              ) {
                if (error) {
                  resObj['message'] = constant['OOPS_ERROR'];
                  utils.callCB(cb, resObj);
                  utils.writeErrorLog(
                    'postJobs',
                    'getPostJobDetails',
                    'Error from _getStepData',
                    error
                  );
                } else {
                  resObj = Object.assign({}, utils.getSuccessResObj());
                  pResult[0]['step_data'] = stepData;
                  declinedApplicants &&
                    (pResult[0]['declined_candidates'] = declinedApplicants);
                  resObj['data'] = {
                    job_detail: pResult[0]
                  };
                  if (
                    userRole === 'seeker' &&
                    (step === 100 ||
                      step === 102 ||
                      step === 103 ||
                      step === 104)
                  ) {
                    resObj['data']['freeze_activity'] = result.freeze_activity;
                  }
                  utils.callCB(cb, resObj);
                }
              });
            } else {
              resObj = Object.assign({}, utils.getSuccessResObj());
              pResult[0]['step_data'] = [];
              pResult[0]['declined_candidates'] = [];
              resObj['data'] = {
                job_detail: pResult[0]
              };
              if (userRole === 'seeker') {
                resObj['data']['freeze_activity'] = result['freeze_activity'];
                resObj['data']['is_bar_id_valid'] = result['is_bar_id_valid'];
              }
              utils.callCB(cb, resObj);
            }
          } else {
            resObj['message'] = constant['NO_RECORD_FOUND'];
            utils.callCB(cb, resObj);
          }
        });
      }
    });
  } else {
    callback({ Code: 400, Status: false, Message: constant['AUTH_FAIL'] });
  }
}

function getPostJobByUserId(req, res, cb) {
  utils.writeInsideFunctionLog('postJobs', 'getPostJobByUserId', req['params']);

  var resObj = Object.assign({}, utils.getErrorResObj());
  if (!!req.headers.token) {
    helper.checkUserLoggedIn(req.headers.token, function(err, result) {
      if (err) {
        resObj['message'] = constant['AUTH_FAIL'];
        resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
        utils.callCB(cb, resObj);
      } else {
        var perPage = 10,
          page = Math.max(0, req.params.page - 1);
        var dbQueryParams = {
          query: { userId: result._id },
          userId: result._id,
          skip: perPage * page,
          limit: Number(perPage)
        };
        post_jobs.getCount(dbQueryParams, function(cErr, cResult) {
          if (cErr) {
            utils.callCB(cb, resObj);
            utils.writeErrorLog(
              'postJobs',
              'getPostJobByUserId',
              'Error while getting job count',
              cErr,
              dbQueryParams['query']
            );
          } else {
            if (cResult > 0) {
              post_jobs.getJobsByUserId(dbQueryParams, function(pErr, pResult) {
                if (pErr) {
                  utils.writeErrorLog(
                    'postJobs',
                    'getPostJobByUserId',
                    'Error while getting job and job status detail',
                    pErr,
                    dbQueryParams['query']
                  );
                } else {
                  if (pResult !== null) {
                    resObj = Object.assign({}, utils.getSuccessResObj());
                    resObj['data'] = {
                      count: cResult,
                      jobs: pResult
                    };
                  } else {
                    resObj['message'] = constant['NO_RECORD_FOUND'];
                  }
                }
                utils.callCB(cb, resObj);
              });
            } else {
              resObj['message'] = constant['NO_RECORD_FOUND'];
              utils.callCB(cb, resObj);
            }
          }
        });
      }
    });
  } else {
    resObj['message'] = constant['AUTH_FAIL'];
    utils.callCB(cb, resObj);
  }
}

function getInvitablePostJobs(req, res, cb) {
  utils.writeInsideFunctionLog(
    'postJobs',
    'getInvitablePostJobs',
    req['params']
  );

  let resObj = Object.assign({}, utils.getErrorResObj());
  if (req.headers.token) {
    helper.checkUserLoggedIn(req.headers.token, function(err, result) {
      if (err) {
        resObj['message'] = constant['AUTH_FAIL'];
        resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
        utils.callCB(cb, resObj);
      } else {
        let dbQueryParams = {
          userId: result._id
        };

        post_jobs.getInvitablePostJobs(dbQueryParams, function(pErr, pResult) {
          if (pErr) {
            utils.writeErrorLog(
              'postJobs',
              'getInvitablePostJobs',
              'Error while getting job and job status detail',
              pErr
            );
          } else if (pResult !== null) {
            resObj = Object.assign({}, utils.getSuccessResObj());
            const filteredResult = pResult.filter(job => {
              if (
                job.total_applied &&
                job.total_applied.length !== 0 &&
                job.total_applied.some(
                  step => step > constant['JOB_STEPS']['INTERVIEWING']
                )
              ) {
                return false;
              } else {
                return true;
              }
            });

            resObj['data'] = {
              jobs: filteredResult
            };
          } else {
            resObj['message'] = constant['NO_RECORD_FOUND'];
          }
          utils.callCB(cb, resObj);
        });
      }
    });
  }
}

function getStepData(req, res, cb) {
  utils.writeInsideFunctionLog('postJobs', 'getStepData');

  let resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req['headers']['token'], function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      let reqBody = req['body'];
      let step = reqBody['step'],
        highestStep = reqBody['highestStep'];
      if (highestStep < 0) {
        let negativeStep = step * -1;
        if (negativeStep <= constant['JOB_STEPS']['INTERVIEWING'] * -1) {
          step = negativeStep;
        }
      }
      let stepDataObj = {
        jobId: reqBody['job_id'],
        step: step,
        userId: reqBody['userId'] ? reqBody['userId'] : result['_id'],
        userRole: reqBody['user_role'],
        filterObj: reqBody['filterObj'],
        userData: result
      };
      _getStepData(stepDataObj, function(error, stepData, declinedApplicants) {
        if (error) {
          resObj['message'] = constant['OOPS_ERROR'];
          utils.callCB(cb, resObj);
          utils.writeErrorLog(
            'postJobs',
            'getStepData',
            'Error from _getStepData',
            error
          );
        } else {
          resObj = Object.assign({}, utils.getSuccessResObj());
          resObj['data'] = {
            step_data: stepData
          };
          declinedApplicants &&
            (resObj['data']['declined_candidates'] = declinedApplicants);
          utils.callCB(cb, resObj);
        }
      });
    }
  });
}

function updateStatus(req, res, cb) {
  utils.writeInsideFunctionLog('postJobs', 'updateStatus', req['body']);

  let resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req['headers']['token'], function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      let jobStatus = req['body']['status'];
      let dbQueryParams = {
        status: jobStatus,
        updated_at: utils.getCurrentDate()()
      };
      if (jobStatus === 1) {
        dbQueryParams['posted_at'] = utils.getCurrentDate()();
      }
      post_jobs.updateQuery(req['body']['job_id'], dbQueryParams, function(
        uErr,
        uRes
      ) {
        if (uErr) {
          utils.writeErrorLog(
            'postJobs',
            'updateStatus',
            'Error while updating job detail',
            uErr,
            { _id: req['body']['job_id'] }
          );
        } else {
          resObj = Object.assign({}, utils.getSuccessResObj());
          resObj['data'] = {
            status: uRes
          };
          if (jobStatus === 1) {
            _sendMailOnPostJob(result, uRes);
          }
        }
        utils.callCB(cb, resObj);
      });
    }
  });
}

module.exports = {
  postJobData,
  getPostJobData,
  getAllPostJobs,
  getPostJobDetails,
  getPostJobByUserId,
  getInvitablePostJobs,
  getStepData,
  updateStatus
};
