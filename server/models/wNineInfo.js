var rfr = require('rfr');
var Cryptr = require('cryptr'),
  cryptr = new Cryptr('SecretKey');

var wNineInfoSchema = rfr('/server/schemas/ddl/wNineInfo'),
jobStatusSchema = rfr('/server/schemas/ddl/jobStatus');

var helper = rfr('/server/models/shared/helper'),
validator = rfr('/server/models/shared/validator');

var jobStatusModel = rfr('/server/models/jobStatus');

var constant = rfr('/server/shared/constant'),
utils = rfr('/server/shared/utils');

function _isTinValid(tin) {
  utils.writeInsideFunctionLog('wNineInfo', '_isTinValid');

  let isValid = false;
  if (utils.isObjectNotEmpty(tin)) {
    let tinType = tin['type'] || '';
    let tinValueArray = !!tin['value'] ? tin['value'].split('-') : [];
    if (tinType.toLowerCase() === 'ssn') {
      isValid = (tinValueArray.length === 3 && tinValueArray[0].length === 3 && tinValueArray[1].length === 2 && tinValueArray[2].length === 4);
    } else if (tinType.toLowerCase() === 'ein') {
      isValid = (tinValueArray.length === 2 && tinValueArray[0].length === 2 && tinValueArray[1].length === 7);
    }
  }
  return isValid;
}

function _updateJobStatusToInProgress(jobId, seekerId, cb) {
  utils.writeInsideFunctionLog('wNineInfo', '_updateJobStatusToInProgress', {'jobId': jobId, 'seekerId': seekerId});

  let dbQueryParams = {
    'query': {
      'job_id': jobId,
      'user_id': seekerId,
      'status': {'$eq': constant['JOB_STEPS']['S_PENDING']}
    }
  }
  let updateData = {
    'status': constant['JOB_STEPS']['IN_PROGRESS'],
    'updated_at': utils.getCurrentDate()()
  }
  jobStatusSchema.updateStatusQuery(dbQueryParams, updateData, function(jErr, jRes) {
    utils.log('Updated job status from Start Pending to In Prgress On Save W-9 information -->', jErr || jRes);
    jobStatusModel.getHighestJobStep(jobId, function(highestJobStep) {
      cb(highestJobStep);
      helper.updatePostJobInProgressStep(jobId);
    });
    if (jErr) {
      utils.writeErrorLog('wNineInfo', '_updateJobStatusToInProgress', 'Error while updating job status', jErr, dbQueryParams['query']);
    }
  });
}

function get(stepDataObj, cb) {
  utils.writeInsideFunctionLog('wNineInfo', 'get');

  let dbQueryParams = {
    'query': {
      'user_id': stepDataObj['userId']
    }
  }

  wNineInfoSchema.findQuery(dbQueryParams, function(wErr, wRes) {
    if (wErr) {
      cb(constant['OOPS_ERROR']);
      utils.writeErrorLog('wNineInfo', 'get', 'Error while getting W-9 information', wErr, dbQueryParams['query']);
    } else {
      delete stepDataObj['userData']['_doc']['job_seeker_info']['basic_profile']['basic_info']['phone_number'];
      let resultObj = {
        'w_nine_info': stepDataObj['userData']['job_seeker_info']['basic_profile']['basic_info'],
        'is_w_nine_info_complete': false,
        'freeze_activity': stepDataObj['userData']['freeze_activity']
      }
      if (!!wRes && wRes.length) {
        wRes[0]['_doc']['tin']['value'] = cryptr.decrypt(wRes[0]['_doc']['tin']['value'])
        resultObj['w_nine_info'] = wRes[0];
        resultObj['is_w_nine_info_complete'] = true;
      } else {
        resultObj['w_nine_info']['user_id'] = stepDataObj['userId'];
      }
      cb(null, [resultObj]);
    }
  });
}

function setAndUpdate(req, res, cb) {
  utils.writeInsideFunctionLog('wNineInfo', 'setAndUpdate');

  let resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req['headers']['token'], function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      let reqBody = req['body'],
      userId = result['_id'];
      let requiredParameters = ['legal_name', 'street_address', 'city', 'state_id', 'zipcode', 'tin', 'fed_tax_classification'];
      let validateObj = validator.missingParameters(reqBody, requiredParameters);
      if (validateObj['isValid']) {
        if (validator.alphaWithDashOnly(reqBody['legal_name']) && validator.maxLength(reqBody['legal_name'], 50, true) && validator.maxLength(reqBody['street_address'], 250, true) && validator.alphaWithDashOnly(reqBody['city']) && validator.maxLength(reqBody['city'], 50, true) && validator.maxLength(reqBody['zipcode'], 5, true) && validator.maxLength(reqBody['tin']['value'], 11, true) && utils.isObjectNotEmpty(reqBody['fed_tax_classification'])) {
          if (_isTinValid(reqBody['tin'])) {
            let dbQueryParams = {
              'query': {'user_id': userId}
            }
            let dataObj = {
              user_id: userId,
              legal_name: reqBody['legal_name'],
              street_address: reqBody['street_address'],
              city: reqBody['city'],
              state_id: reqBody['state_id'],
              zipcode: reqBody['zipcode'],
              tin: {
                'type': reqBody['tin']['type'],
                'value': cryptr.encrypt(reqBody['tin']['value'])
              },
              fed_tax_classification: reqBody['fed_tax_classification'],
              updated_at: utils.getCurrentDate()()
            };

            (!reqBody['is_w_nine_info_complete']) && (dataObj['created_at'] = utils.getCurrentDate()());
            wNineInfoSchema.updateQuery(dbQueryParams, dataObj, function(wErr, wRes) {
              if (utils.isObjectNotEmpty(wRes)) {
                resObj = Object.assign({}, utils.getSuccessResObj());
                wRes['_doc']['tin']['value'] = cryptr.decrypt(wRes['_doc']['tin']['value'])
                resObj['data'] = {
                  'is_w_nine_info_complete': true,
                  'w_nine_info': wRes,
                  'current_highest_job_step': constant['JOB_STEPS']['S_PENDING']
                }
              } else {
                utils.writeErrorLog('wNineInfo', 'setAndUpdate', 'Error while updating W-9 information', (wErr || wRes), dbQueryParams['query']);
              }
              jobStatusModel.getStripeChargeDetails(req['body']['job_id'], function(jErr, jRes) {
                if (!!jRes && jRes.length) {
                  if (jRes[0]['status'] === constant['PAYMENT_STATUS']['FUND_TRANSFER_SUCCESSFUL']) {
                    _updateJobStatusToInProgress(req['body']['job_id'], result['_id'], function(highestJobStep) {
                      resObj['data']['current_highest_job_step'] = highestJobStep;
                      utils.callCB(cb, resObj);
                    });
                  } else {
                    utils.callCB(cb, resObj);
                  }
                } else {
                  utils.callCB(cb, resObj);
                }
              });
            });
          } else {
            resObj['message'] = constant['INVALID_FORMAT'];
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
    }
  });
}

module.exports =  {
  get,
  setAndUpdate
}
