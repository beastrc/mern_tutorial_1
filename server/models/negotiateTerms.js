var rfr = require('rfr'),
moment = require('moment'),
mongoose = require('mongoose'),
ObjectId = mongoose.Types.ObjectId;

var nTermsSchema = rfr('/server/schemas/ddl/negotiateTerms'),
postJobSchema = rfr('/server/schemas/ddl/postJobs'),
userSchema = rfr('/server/schemas/ddl/users'),
jobStatusSchema = rfr('/server/schemas/ddl/jobStatus');

var profileModel = rfr('/server/models/users/profile'),
jobStatusModel = rfr('/server/models/jobStatus');

var helper = rfr('/server/models/shared/helper'),
validator = rfr('/server/models/shared/validator');

var constant = rfr('/server/shared/constant'),
utils = rfr('/server/shared/utils'),
mailHelper = rfr('/server/shared/mailHelper');

function get(stepDataObj, cb) {
  let dbQueryParams = {
    'query': {
      'jobId': stepDataObj['jobId'],
      'status': {'$gte': constant['N_TERMS_STATUS']['NOT_SENT']}
    }
  }

  if (stepDataObj['userRole'] === constant['ROLE']['SEEKER']) {
    dbQueryParams['query'] = {'jobId': stepDataObj['jobId'], 'seekerId': stepDataObj['userId']};
  }

  utils.writeInsideFunctionLog('negotiateTerms', 'get', dbQueryParams['query']);

  nTermsSchema.findQuery(dbQueryParams, function(nErr, nResult) {
    if (nErr) {
      cb(constant['OOPS_ERROR']);
      utils.writeErrorLog('negotiateTerms', 'get', 'Error while getting negotiate terms detail', nErr, dbQueryParams['query']);
    } else {
      if (nResult.length > 0) {
        let nResultObj = nResult[0];
        dbQueryParams['query'] =  { "_id": nResultObj['seekerId'] };
        userSchema.findQuery(dbQueryParams, function(uErr, uResult){
          if (uErr) {
            cb(constant['OOPS_ERROR']);
            utils.writeErrorLog('negotiateTerms', 'get', 'Error while getting user detail', uErr, dbQueryParams['query']);
          } else {
            if (uResult.length > 0) {
              nResultObj['_doc']['seekerFirstName'] = uResult[0]['first_name'];
              nResultObj['_doc']['seekerLastName'] = uResult[0]['last_name'];
              nResultObj['_doc']['freeze_activity'] = uResult[0]['freeze_activity'];
              cb(null, [nResultObj]);
            } else {
              cb(constant['NO_RECORD_FOUND']);
            }
          }
        });
      } else {
        cb(constant['NO_RECORD_FOUND']);
      }
    }
  });
}

function _isDueDateInSequentialOrder(timestampArr) {
  utils.writeInsideFunctionLog('negotiateTerms', '_isDueDateInSequentialOrder');

  return timestampArr.every((val, i, arr) => !i || (val >= arr[i - 1]));
}

function update(req, res, cb) {
  utils.writeInsideFunctionLog('negotiateTerms', 'update');

  let resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req['headers']['token'], function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      let reqBody = req['body'];
      let validateObj = {};
      validateObj = validator.missingParameters(reqBody, ['jobType', 'paymentType']);
      if (validateObj['isValid']) {
        if (reqBody.jobType == '1099' && reqBody.paymentType == 'Hourly Rate/Fixed Fee') {
          let requiredParameters = ['jobId', 'seekerId', 'posterId', 'rate', 'rateType', 'hoursType'];
          validateObj = validator.missingParameters(reqBody, requiredParameters);
        } else {
          let requiredParameters = ['jobId', 'seekerId', 'posterId', 'rate', 'rateType', 'hoursType', 'subTotal', 'total', 'currentRate'];
          validateObj = validator.missingParameters(reqBody, requiredParameters);
        }
        if (validateObj['isValid']) {
          if (validator.maxLength(reqBody['rate'], 6, true) && validator.maxLength(reqBody['hours'], 3, false)) {
            if (reqBody['subTotal'] >= 100 || (reqBody.jobType == '1099' && reqBody.paymentType == 'Hourly Rate/Fixed Fee' && reqBody.rateType == 'HOURLY')) {
              let userQueryParams = {
                'query': {'_id': reqBody['seekerId']}
              };
              userSchema.findQuery(userQueryParams, function(uErr, uRes) {
                if (!!uRes && uRes.length) {
                  let freezeActivity = uRes[0]['freeze_activity'];
                  if (freezeActivity !== reqBody['freeze_activity']) {
                    resObj['code'] = constant['RES_OBJ']['CODE']['CONFLICT'];
                    resObj['message'] = constant['RES_OBJ']['MSG']['CONFLICT'];
                    utils.callCB(cb, resObj);
                  } else if (freezeActivity) {
                    resObj['code'] = constant['RES_OBJ']['CODE']['LOCKED'];
                    resObj['message'] = constant['RES_OBJ']['MSG']['LOCKED'];
                    utils.callCB(cb, resObj);
                  } else {
                    let reqPaymentDetails = reqBody['paymentDetails'];
                    let len = reqPaymentDetails.length;
                    if (len > 0) {
                      let count = 0;
                      let timestampArr = [];
                      for(let i = 0; i < len; i++) {
                        if (reqPaymentDetails[i].rate === 0 && !reqPaymentDetails[i].delivery && !reqPaymentDetails[i].dueDate && !(req.body.jobType == '1099' && req.body.paymentType == 'Hourly Rate/Fixed Fee')) {
                          reqPaymentDetails.splice(i, 1);
                          i--;
                        } else {
                          if ((reqPaymentDetails[i].dueDate && !moment(reqPaymentDetails[i].dueDate).isBefore(utils.getCurrentEstDate())) || (req.body.jobType == '1099' && req.body.paymentType == 'Hourly Rate/Fixed Fee')) {
                            timestampArr.push(new Date(reqPaymentDetails[i].dueDate).getTime());
                            count++;
                          } else {
                            resObj['message'] = constant['MILESTONE_DUE_DATE_ERROR'];
                            utils.callCB(cb, resObj);
                            return;
                          }
                        }
                      }
                      if ((_isDueDateInSequentialOrder(timestampArr) || (req.body.jobType == '1099' && req.body.paymentType == 'Hourly Rate/Fixed Fee')) && (count === len)) {
                        let dbQueryParams = {
                          'query': {
                            'job_id': reqBody['jobId'],
                            'user_id': reqBody['seekerId']
                          }
                        }
                        jobStatusSchema.findQuery(dbQueryParams, function(jErr, jRes) {
                          if (!!jRes && jRes.length) {
                            if (jRes[0]['status'] === constant['JOB_STEPS']['N_TERMS']) {
                              updateNegotiateTerms(reqBody, function(resp) {
                                utils.callCB(cb, resp);
                              });
                            } else {
                              resObj['code'] = constant['RES_OBJ']['CODE']['CONFLICT'];
                              resObj['message'] = constant['RES_OBJ']['MSG']['CONFLICT'];
                              utils.callCB(cb, resObj);
                            }
                          } else {
                            utils.callCB(cb, resObj);
                            utils.writeErrorLog('negotiateTerms', 'update', 'Error while getting job status detail', (jErr || jRes), dbQueryParams['query']);
                          }
                        });
                      } else {
                        resObj['message'] = constant['MILESTONE_DUE_DATE_ORDER'];
                        utils.callCB(cb, resObj);
                      }
                    } else {
                      utils.callCB(cb, resObj);
                    }
                  }
                } else {
                  utils.callCB(cb, resObj);
                  utils.writeErrorLog('negotiateTerms', 'update', 'Error while getting user detail', (uErr || uRes), userQueryParams['query']);
                }
              });
            } else {
              resObj['message'] = constant['MIN_JOB_AMOUNT'];
              utils.callCB(cb, resObj);
            }
          } else {
            resObj['message'] = constant['INVALID_FORMAT'];
            utils.callCB(cb, resObj);
          }
        } else {
          resObj['message'] = constant['EMPTY_FIELD_ERROR'];
          utils.callCB(cb, resObj);
        }
      } else {
        resObj['message'] = constant['EMPTY_FIELD_ERROR'];
        utils.callCB(cb, resObj);
      }
    }
  });
}

function updateNegotiateTerms(reqBody, cb) {
  utils.writeInsideFunctionLog('negotiateTerms', 'updateNegotiateTerms');

  let id = reqBody['_id'];
  delete reqBody['_id'];
  reqBody['status'] = constant['N_TERMS_STATUS']['SENT'];
  reqBody['updated_at'] = utils.getCurrentDate()();
  for (let [i, obj] of reqBody['paymentDetails'].entries()) {
    obj['milestone'] = i + 1;
  }
  let dbQueryParams = {
    'query': {'_id': id}
  }
  nTermsSchema.updateQuery(dbQueryParams, reqBody, function(nErr, nRes) {
    let resObj = Object.assign({}, utils.getErrorResObj());
    if (utils.isObjectNotEmpty(nRes)) {
      resObj = Object.assign({}, utils.getSuccessResObj());
      resObj['data'] = {
       'n_terms': nRes
      }
    } else {
      utils.writeErrorLog('negotiateTerms', 'updateNegotiateTerms', 'Error while getting updating negotiate terms detail', (nErr || nRes), dbQueryParams['query']);
    }
    cb(resObj);
  });
}

function updateHourlyFixedTerms(req, res, cb) {
  utils.writeInsideFunctionLog('negotiateTerms', 'updateHourlyFixedTerms');
  let resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req.headers.token, function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      let reqBody = req['body'];
      let dbQueryParams = {
        'query': {
          'jobId': ObjectId(reqBody['jobId']),
          'status': { '$eq': constant['N_TERMS_STATUS']['ACCEPTED'] }
        }
      }

      let updateData = {
        'paymentDetails.$.rate': reqBody['subTotal'],
        'hours': reqBody['hours'] ? reqBody['hours'] : 0,
        'subTotal': reqBody['subTotal'],
        'total': reqBody['total'],
        'updated_at': utils.getCurrentDate()(),
      }

      nTermsSchema.getNonPaidDeliverables(dbQueryParams, function(err, res) {
        if (!!res && res.length) {
          if ((res[0]['paymentDetails']['milestone'] === reqBody['paymentDetails']['milestone']) && (res[0]['paymentDetails']['_id'].toString() === reqBody['paymentDetails']['_id'])) {
            _updateHourlyFixedTerms(reqBody, updateData, result, cb);
          } else {
            resObj['message'] = constant['ACTION_DENIED'];
            utils.callCB(cb, resObj);
          }
        } else {
          utils.callCB(cb, resObj);
          utils.writeErrorLog('negotiateTerms', 'updateHourlyFixedTerms', 'Error while getting non paid deliverables detail', (err || res), dbQueryParams['query']);
        }
      });
    }
  });
}

function _updateHourlyFixedTerms (reqBody, updateData, userData, cb) {
  let resObj = Object.assign({}, utils.getErrorResObj());
  let dbQueryParams = {
    'query': {
      'jobId': reqBody['jobId'],
      'status': { '$eq': constant['N_TERMS_STATUS']['ACCEPTED'] },
      'paymentDetails.milestone': reqBody['paymentDetails']['milestone']
    }
  }

  utils.writeInsideFunctionLog('negotiateTerms', '_updateHourlyFixedTerms', dbQueryParams['query']);

  nTermsSchema.updateQuery(dbQueryParams, updateData, function(nErr, nRes) {
    if (utils.isObjectNotEmpty(nRes)) {
      resObj = Object.assign({}, utils.getSuccessResObj());
      resObj['data'] = {
        'freeze_activity': userData.freeze_activity,
      }
      utils.callCB(cb, resObj);
    } else {
      utils.callCB(cb, resObj);
      utils.writeErrorLog('negotiateTerms', '_updateHourlyFixedTerms', 'Error while updating negotiate hourly terms detail', (nErr || nRes), dbQueryParams['query']);
    }
  });
}

function updateDeliverableStatus(req, res, cb) {
  utils.writeInsideFunctionLog('negotiateTerms', 'updateDeliverableStatus');

  let resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req.headers.token, function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      let reqBody = req['body'];
      let dbQueryParams = {
        'query': {
          'jobId': ObjectId(reqBody['jobId']),
          'status': { '$eq': constant['N_TERMS_STATUS']['ACCEPTED'] }
        }
      }

      let updateData = {
        'paymentDetails.$.status': reqBody['status'],
        'updated_at': utils.getCurrentDate()()
      }

      nTermsSchema.getNonPaidDeliverables(dbQueryParams, function(err, res) {
        if (!!res && res.length) {
          if ((res[0]['paymentDetails']['milestone'] === reqBody['milestone']) && (res[0]['paymentDetails']['_id'].toString() === reqBody['milestone_id'])) {
            if (reqBody['status'] === constant['DELIVERABLE_STATUS']['SUBMITTED'] && reqBody['fileObj']) {
              profileModel.uploadDeliverable(reqBody['fileObj'], result['_id'], reqBody['jobId'], 'upload', function(uErr, uRes) {
                if (uErr) {
                  resObj['message'] = constant['UPLOAD_ERROR'];
                  utils.callCB(cb, resObj);
                } else {
                  updateData['paymentDetails.$.filepath'] = uRes['filepath'];
                  updateData['paymentDetails.$.filename'] = uRes['filename'];
                  _updateStatus(reqBody, updateData, result, cb);
                }
              });
            } else if(reqBody['status'] === constant['DELIVERABLE_STATUS']['DECLINED'] && reqBody['filepath']) {
              profileModel.uploadDeliverable(reqBody['filepath'], null, null, 'delete', function(uErr, uREs) {
                if (uErr) {
                  utils.callCB(cb, resObj);
                } else {
                  updateData['paymentDetails.$.filepath'] = '';
                  updateData['paymentDetails.$.filename'] = '';
                  _updateStatus(reqBody, updateData, result, cb);
                }
              });
            } else {
              _updateStatus(reqBody, updateData, result, cb, 'release_payment');
            }
          } else {
            resObj['message'] = constant['ACTION_DENIED'];
            utils.callCB(cb, resObj);
          }
        } else {
          utils.callCB(cb, resObj);
          utils.writeErrorLog('negotiateTerms', 'updateDeliverableStatus', 'Error while getting non paid deliverables detail', (err || res), dbQueryParams['query']);
        }
      });
    }
  });
}

function _updateStatus (reqBody, updateData, userDataObj, cb, url) {
  let resObj = Object.assign({}, utils.getErrorResObj());
  let dbQueryParams = {
    'query': {
      'jobId': reqBody['jobId'],
      'status': { '$eq': constant['N_TERMS_STATUS']['ACCEPTED'] },
      'paymentDetails.milestone': reqBody['milestone']
    }
  }

  utils.writeInsideFunctionLog('negotiateTerms', '_updateStatus', dbQueryParams['query']);

  nTermsSchema.updateQuery(dbQueryParams, updateData, function(nErr, nRes) {
    if (utils.isObjectNotEmpty(nRes)) {
      resObj = Object.assign({}, utils.getSuccessResObj());
      resObj['data'] = {
        'job_completed': false
      }
      !!url && (resObj['data']['url'] = url);
      utils.callCB(cb, resObj);
      _sendMailOnDeliverable(reqBody['status'], userDataObj, nRes);
    } else {
      utils.callCB(cb, resObj);
      utils.writeErrorLog('negotiateTerms', '_updateStatus', 'Error while updating negotiate terms detail', (nErr || nRes), dbQueryParams['query']);
    }
  });
}

function _sendMailOnDeliverable(action, userDataObj, nTermsDetails) {
  utils.writeInsideFunctionLog('negotiateTerms', '_sendMailOnDeliverable', {'action': action});

  let dbQueryParams = {
    'query': { '_id': nTermsDetails['jobId'] }
  }
  postJobSchema.findQuery(dbQueryParams, function(pErr, pRes) {
    if (!!pRes && pRes.length) {
      let submittedStatus = constant['DELIVERABLE_STATUS']['SUBMITTED'];
      dbQueryParams['query'] = { _id: nTermsDetails['seekerId'] };
      if (action === submittedStatus) {
        dbQueryParams['query'] = { _id: nTermsDetails['posterId'] };
      }
      userSchema.findQuery(dbQueryParams, function(uErr, uRes) {
        if (!!uRes && uRes.length) {
          let mailObj = {
            'recieverFirstName': uRes[0]['first_name'],
            'jobName': utils.toTitleCase(pRes[0]['jobHeadline'])
          };
          if (action === submittedStatus) {
            mailHelper.sendMailInBackground(uRes[0]['email'], 'Milestone Deliverable Uploaded', 'MILESTONE_UPLOADED', mailObj);
          } else {
            let subject = 'Milestone Deliverable Accepted';
            let msgKey = 'MILESTONE_APPROVED';
            if (action === constant['DELIVERABLE_STATUS']['DECLINED']) {
              subject = 'Deliverable Rejected';
              msgKey = 'MILESTONE_REJECTED';
            }
            mailHelper.sendMailInBackground(uRes[0]['email'], subject, msgKey, mailObj);
          }
        } else {
          utils.writeErrorLog('negotiateTerms', '_sendMailOnDeliverable', 'Error while getting user detail', (uErr || uRes), dbQueryParams['query']);
        }
      });
    } else {
      utils.writeErrorLog('negotiateTerms', '_sendMailOnDeliverable', 'Error while getting job detail', (pErr || pRes), dbQueryParams['query']);
    }
  });
}

function downloadDeliverableFile (req, res, cb) {
  utils.writeInsideFunctionLog('negotiateTerms', 'downloadDeliverableFile', req['body']);

  let resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req.headers.token, function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      let reqBody = req.body;
      profileModel.downloadFile(reqBody['filepath'], function(dErr, dRes) {
        if (dErr) {
          resObj['message'] = constant['OOPS_ERROR'];
          utils.callCB(cb, resObj);
        } else {
          let file, attachment;
          file = new Buffer(dRes.Body, 'binary');
          attachment = file.toString('base64');
          resObj = Object.assign({}, utils.getSuccessResObj());
          resObj['data'] = {
            'fileData': attachment
          };
          utils.callCB(cb, resObj);
        }
      });
    }
  });
}

module.exports =  {
  get,
  update,
  updateNegotiateTerms,
  updateHourlyFixedTerms,
  updateDeliverableStatus,
  downloadDeliverableFile
}
