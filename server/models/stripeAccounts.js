var rfr = require('rfr'),
request = require('request'),
mongoose = require('mongoose'),
ObjectId = mongoose.Types.ObjectId,
users = mongoose.model('users');

var nTermsModel = rfr('/server/models/negotiateTerms'),
jobStatusModel = rfr('/server/models/jobStatus'),
profileModel = rfr('/server/models/users/profile');

var jobStatusSchema = rfr('/server/schemas/ddl/jobStatus'),
stripeAccSchema = rfr('/server/schemas/ddl/stripeAccounts'),
stripeChargeSchema = rfr('/server/schemas/ddl/stripeCharges'),
wNineInfoSchema = rfr('/server/schemas/ddl/wNineInfo'),
nTermsSchema = rfr('/server/schemas/ddl/negotiateTerms'),
userSchema = rfr('/server/schemas/ddl/users');

var helper = rfr('/server/models/shared/helper'),
config = rfr('/server/shared/config'),
constant = rfr('/server/shared/constant'),
logger = rfr('/server/shared/logger'),
mailHelper = rfr('/server/shared/mailHelper'),
utils = rfr('/server/shared/utils');

var stripe = require("stripe")(config['stripe']['secret_key']);

function _checkStripeAccountAndWNineInfoStatus(dataObj, cb) {
  utils.writeInsideFunctionLog('stripeAccounts', '_checkStripeAccountAndWNineInfoStatus', dataObj);

  _checkStripeAccountStatus(dataObj['seekerId'], function(status) {
    if (status) {
      let dbQueryParams = {
        'query': {
          'user_id': dataObj['seekerId']
        }
      }
      wNineInfoSchema.findQuery(dbQueryParams, function(wErr, wRes) {
        if (!!wRes) {
          if (wRes.length) {
            cb(null, true);
          } else {
            logger.warn('[stripeAccounts] - User has not filled his W-9 information.');
            cb(true);
          }
        } else {
          cb(true);
          utils.writeErrorLog('stripeAccounts', '_checkStripeAccountAndWNineInfoStatus', 'Error while getting W-9 information', wErr, dbQueryParams['query']);
        }
      });
    } else {
      cb(true);
    }
  });
}

function _checkStripeAccountStatus(seekerId, cb) {
  utils.writeInsideFunctionLog('stripeAccounts', '_checkStripeAccountStatus', {'seekerId': seekerId});
  let dbQueryParams = {
    'query': {
      'user_id': seekerId
    }
  };
  stripeAccSchema.findQuery(dbQueryParams, function(sErr, sRes) {
    if(sRes && sRes.length) {
      logger.info('[stripeAccounts] - User has a stripe account');
      cb(true);
    } else {
      cb(false);
      utils.writeErrorLog('stripeAccounts', '_checkStripeAccountStatus', 'Error while getting user stripe account status', (sErr || sRes), dbQueryParams);
    }
  });
}

function setStripeAccountInfo(req, res, cb) {
  utils.writeInsideFunctionLog('stripeAccounts', 'setStripeAccountInfo', req['body']);

  let resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req['headers']['token'], function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      let postData = {
        'code': req['body']['stripe_auth_code'],
        'client_secret': config['stripe']['secret_key'],
        'grant_type': 'authorization_code'
      }

      request.post(
        'https://connect.stripe.com/oauth/token',
        { json: postData },
        function (error, response, body) {
          if (!error && response && response.statusCode === 200) {
            let dataObj = {
              'user_id': result['_id'],
              'stripe_user_id': body['stripe_user_id'],
              'stripe_refresh_token': body['refresh_token'],
              'stripe_token_type': body['token_type']
            }

            stripeAccSchema.createQuery(dataObj, function(sErr, sRes) {
              if (sErr) {
                utils.callCB(cb, resObj);
                utils.writeErrorLog('stripeAccounts', 'setStripeAccountInfo', 'Error while creating entry in stripe account', sErr, dataObj);
              } else {
                resObj = Object.assign({}, utils.getSuccessResObj());
                utils.callCB(cb, resObj);
              }
            });
          } else {
            resObj['code'] = constant['RES_OBJ']['CODE']['FAILED_DEPENDENCY'];
            resObj['message'] = utils.getStripeErrorMsg(body, 'error_description');
            utils.callCB(cb, resObj);
            utils.writeErrorLog('stripeAccounts', 'setStripeAccountInfo', 'Error while getting user account information from stripe', (error || body), postData);
          }
        }
      );
    }
  });
}

function transferFunds(req, res, cb) {
  utils.writeInsideFunctionLog('stripeAccounts', 'transferFunds', req['body']);

  let resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req['headers']['token'], function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      let jobId = req['body']['job_id'];
      let userId = req['body']['user_id']; // req.body.user_id
      if (jobId && userId) {
        let dbQueryParams = {
          'query': { '_id': userId }
        };
        users.findQuery(dbQueryParams, function(uErr, uRes) {
          if (uErr) {
            utils.callCB(cb, resObj);
            utils.writeErrorLog('stripeAccounts', 'transferFunds', 'Error while getting user detail', uErr, dbQueryParams['query']);
          } else {
            if (uRes[0]['freeze_activity'] !== req['body']['freeze_activity']) {
              resObj['code'] = constant['RES_OBJ']['CODE']['CONFLICT'];
              resObj['message'] = constant['RES_OBJ']['MSG']['CONFLICT'];
              utils.callCB(cb, resObj);
            } else if (uRes[0]['freeze_activity']) {
              resObj['code'] = constant['RES_OBJ']['CODE']['LOCKED'];
              resObj['message'] = constant['INVALID_BAR_ID'];
              utils.callCB(cb, resObj);
            } else {
              dbQueryParams['query'] = {
                'jobId': jobId,
                'status': { '$eq': constant['N_TERMS_STATUS']['ACCEPTED'] }
              }
              nTermsSchema.findQuery(dbQueryParams, function(nErr, nRes) {
                if (!!nRes && nRes.length) {
                  dbQueryParams['query'] = {
                    'user_id': result['_id']
                  };
                  stripeAccSchema.findQuery(dbQueryParams, function(sErr, sRes) {
                    if (!!sRes && sRes.length) {
                      stripe.charges.create({
                        amount: nRes[0]['total'] * constant['CENT_TO_DOLLAR'],
                        currency: 'usd',
                        source: sRes[0]['stripe_user_id'],
                        description: 'Charge for ' + jobId,
                        receipt_email: result['email'],
                        metadata: {'id': jobId}
                      }).then(function(charge) {
                        logger.info('[stripeAccounts] | <transferFunds> - Stripe Account,', JSON.stringify(charge));
                        let dataObj = {
                          'job_id': jobId,
                          'poster_id': result['_id'],
                          'seeker_id': userId,
                          'stripe_source_account_id': charge['source']['id'],
                          'stripe_charge_id': charge['id'],
                          'amount': charge['amount'],
                          'stripe_balance_transaction': charge['balance_transaction'],
                          'stripe_created_at': charge['created'] * 1000 // conver second to millsecond
                        }
                        stripeChargeSchema.createQuery(dataObj, function(sCErr, sCRes) {
                          if (sCErr) {
                            utils.callCB(cb, resObj);
                            utils.writeErrorLog('stripeAccounts', 'transferFunds', 'Error while creating entry in stripe charge', sCErr, dataObj);
                          } else {
                            resObj = Object.assign({}, utils.getSuccessResObj());
                            resObj['data'] = {
                              'transfer_funds_status': sCRes['status']
                            }
                            utils.callCB(cb, resObj);
                          }
                        });
                      }, function(stripeErr) {
                        resObj['code'] = constant['RES_OBJ']['CODE']['FAILED_DEPENDENCY'];
                        resObj['message'] = utils.getStripeErrorMsg(stripeErr);
                        utils.callCB(cb, resObj);
                        utils.writeErrorLog('stripeAccounts', 'transferFunds', 'Error while creating charges on stripe', stripeErr);
                      });
                    } else {
                      utils.callCB(cb, resObj);
                      utils.writeErrorLog('stripeAccounts', 'transferFunds', 'Error while getting stripe account detail', (sErr || sRes), dbQueryParams['query']);
                    }
                  });
                } else {
                  utils.callCB(cb, resObj);
                  utils.writeErrorLog('stripeAccounts', 'transferFunds', 'Error while getting negotiate terms detail', (nErr || nRes), dbQueryParams['query']);
                }
              });
            }
          }
        });
      } else {
        resObj['message'] = constant['INVALID_PARAMETER'];
        utils.callCB(cb, resObj);
      }
    }
  });
}

function getReleaseFundUrl(req, res, cb) {
  utils.writeInsideFunctionLog('stripeAccounts', 'getReleaseFundUrl', req['body']);

  let resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req['headers']['token'], function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      let jobId = req['body']['job_id'];
      if(!!jobId) {
        let dbQueryParams = {
          'query': {
            'jobId': jobId,
            'status': { '$eq': constant['N_TERMS_STATUS']['ACCEPTED'] }
          }
        }
        nTermsSchema.findQuery(dbQueryParams, function(nErr, nRes) {
          if (!!nRes && nRes.length) {
            let obj = nRes[0]['paymentDetails'].find(function(item) {
              return (item['milestone'] === req['body']['milestone'] && item['_id'].toString() === req['body']['milestone_id']);
            });

            if (utils.isObjectNotEmpty(obj) && obj['status'] === constant['DELIVERABLE_STATUS']['APPROVED']) {
              resObj = Object.assign({}, utils.getSuccessResObj());
              resObj['data'] = {
                'url': 'release_payment'
              }
              utils.callCB(cb, resObj);
            } else if (utils.isObjectNotEmpty(obj) && obj['status'] >= constant['DELIVERABLE_STATUS']['RELEASED']) {
              dbQueryParams['query'] = {
                'job_id': jobId,
                'status': { '$eq': constant['JOB_STEPS']['J_COMPLETE'] }
              }
              jobStatusSchema.findQuery(dbQueryParams, function(jErr, jRes) {
                resObj['code'] = constant['RES_OBJ']['CODE']['CONFLICT'];
                resObj['message'] = constant['RES_OBJ']['MSG']['CONFLICT'];
                resObj['data']['job_completed'] = !!(jRes && jRes.length);
                utils.callCB(cb, resObj);
                if (jErr) {
                  utils.writeErrorLog('stripeAccounts', 'getReleaseFundUrl', 'Error while getting job status detail', jErr, dbQueryParams['query']);
                }
              });
            } else {
              utils.callCB(cb, resObj);
            }
          } else {
            utils.callCB(cb, resObj);
            utils.writeErrorLog('stripeAccounts', 'getReleaseFundUrl', 'Error while getting negotiate terms detail', (nErr || nRes), dbQueryParams['query']);
          }
        });
      } else {
        resObj['message'] = constant['INVALID_PARAMETER'];
        utils.callCB(cb, resObj);
      }
    }
  });
}

function getSetPreferencesStatus(req, res, cb) {
  utils.writeInsideFunctionLog('stripeAccounts', 'getSetPreferencesStatus', req['params']);

  let resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req['headers']['token'], function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      let dbQueryParams = {
        'userId': result['_id'],
        'userRole': constant['ROLE']['SEEKER']
      }
      stripeAccSchema.findAccountDetails(dbQueryParams, function(sErr, sRes) {
        if (sErr) {
          utils.callCB(cb, resObj);
          utils.writeErrorLog('stripeAccounts', 'getSetPreferencesStatus', 'Error while getting stripe account detail', (sErr || sRes), dbQueryParams['query']);
        } else {
          resObj = Object.assign({}, utils.getSuccessResObj());
          resObj['data'] = {
            'stripe_account_status': constant['STRIPE_ACCOUNT_STATUS']['NOT_CREATED']
          };
          let accountDetails = sRes[0];
          accountDetails && (resObj['data']['stripe_account_status'] = accountDetails['status']);
          utils.callCB(cb, resObj);
        }
      });
    }
  });
}

function _getUserDetail(userId, cb) {
  let dbQueryParams = {
    'query': {'_id': userId}
  }
  users.findQuery(dbQueryParams, function(err, result) {
    cb(err, result);
  });
}

function _sendMailFromWebhook(dataObj, mailData) {
  utils.writeInsideFunctionLog('stripeAccounts', '_sendMailFromWebhook');

  jobStatusModel.getJobDetail(dataObj['job_id'], function(jErr, jRes) {
    if (!!jRes && jRes.length) {
      let mailObj = {
        jobName: utils.toTitleCase(jRes[0]['jobHeadline'])
      }
      _getUserDetail(dataObj['poster_id'], function(pErr, pRes) {
        if (!!pRes && pRes.length) {
          mailObj['recieverFirstName'] = pRes[0]['first_name'];
          mailHelper.sendMailInBackground(pRes[0]['email'], mailData['subject'], mailData['poster_mail_body_key'], mailObj);
        } else {
          utils.writeErrorLog('stripeAccounts', '_sendMailFromWebhook', 'Error while getting poster information at the time of sending mail from webhook', (pErr || pRes), {'poster_id': poster_id});
        }
      });
      _getUserDetail(dataObj['seeker_id'], function(sErr, sRes) {
        if (!!sRes && sRes.length) {
          mailObj['recieverFirstName'] = sRes[0]['first_name'];
          mailHelper.sendMailInBackground(sRes[0]['email'], mailData['subject'], mailData['seeker_mail_body_key'], mailObj);
        } else {
          utils.writeErrorLog('stripeAccounts', '_sendMailFromWebhook', 'Error while getting seeker information at the time of sending mail from webhook', (sErr || sRes), {'seeker_id': seeker_id});
        }
      });
    }
  });
}

function webhook(req, res) {
  let reqBody = req['body'];

  utils.writeInsideFunctionLog('stripeAccounts', 'webhook', reqBody);

  switch(reqBody['type']) {
    case constant['STRIPE_EVENT_TYPE']['ACCOUNT_APPLICATION_AUTHORIZED']: _updateStripeAccountStatus(reqBody, constant['STRIPE_ACCOUNT_STATUS']['ACTIVATED']);
    break;
    case constant['STRIPE_EVENT_TYPE']['TRANSFER_FUND_PAID']: _fundsInStripe(reqBody, constant['PAYMENT_STATUS']['FUND_TRANSFER_SUCCESSFUL']);
    break;
    case constant['STRIPE_EVENT_TYPE']['RELEASE_PAYMENT_PAID']: _updateMilestomePaymentStatus(reqBody, constant['DELIVERABLE_STATUS']['PAID']);
    break;
  }
  res.sendStatus(constant['RES_OBJ']['CODE']['SUCCESS']);
}

function _updateStripeAccountStatus(webhookObj, status) {
  utils.writeInsideFunctionLog('stripeAccounts', '_updateStripeAccountStatus', {'stripeAccount': webhookObj['account'], 'status': status});

  let dbQueryParams = {
    'query': { 'stripe_user_id': webhookObj['account'], 'status': constant['STRIPE_ACCOUNT_STATUS']['CREATED'] },
    'data': { 'status': status }
  };
  stripeAccSchema.updateQuery(dbQueryParams, function(sErr, sRes) {
    if (utils.isObjectNotEmpty(sRes)) {
      logger.info('[stripeAccounts] | <_updateStripeAccountStatus> - Stripe Account Status updated successfully');
    } else {
      utils.writeErrorLog('stripeAccounts', '_updateStripeAccountStatus', 'Error while updating account status', (sErr || sRes), dbQueryParams['query']);
    }
  });
}

function _fundsInStripe(webhookObj, status) {
  if (!webhookObj['data']['object']['metadata'].hasOwnProperty('m_id')) {
    utils.writeInsideFunctionLog('stripeAccounts', '_fundsInStripe', webhookObj);
    let dbQueryParams = {
      'query': {
        'stripe_balance_transaction': webhookObj['data']['object']['balance_transaction'],
        'stripe_source_account_id': webhookObj['data']['object']['source']['id']
      },
      'data': { 'status': status}
    };
    stripeChargeSchema.updateQuery(dbQueryParams, function(orderErr, orderRes) {
      if (utils.isObjectNotEmpty(orderRes)) {
        logger.info('[stripeAccounts] - Stripe payment Status updated to -->', utils.getStringifyObj(orderRes['status']));
        if (status === constant['PAYMENT_STATUS']['FUND_TRANSFER_SUCCESSFUL']) {
          let dataObj = {
            'seekerId': orderRes['seeker_id']
          }
          _checkStripeAccountAndWNineInfoStatus(dataObj, function(err, res) {
            if (res) {
              dbQueryParams['query'] = {
                'job_id': orderRes['job_id'],
                'user_id': orderRes['seeker_id']
              }
              let updateData = {
                'status': constant['JOB_STEPS']['IN_PROGRESS'],
                'updated_at': utils.getCurrentDate()()
              }
              jobStatusSchema.updateStatusQuery(dbQueryParams, updateData, function(jErr, jRes) {
                if (utils.isObjectNotEmpty(jRes)) {
                  logger.info('[stripeAccounts] - Updated Job Status from Start Pending to In Prgress at the time of Transfer Funds webhook trigger -->', utils.getStringifyObj(jRes));
                  helper.updatePostJobInProgressStep(orderRes['job_id']);
                } else {
                  utils.writeErrorLog('stripeAccounts', '_fundsInStripe', 'Error while updating job status detail', (jErr || jRes), dbQueryParams['query']);
                }
              });
            }
          });

          let mailData = {
            'subject': 'Job Payment In Stripe',
            'poster_mail_body_key': 'PAYMENT_TRANSFERED_IN_ESCROW_FOR_POSTER',
            'seeker_mail_body_key': 'PAYMENT_TRANSFERED_IN_ESCROW_FOR_SEEKER'
          }
          _sendMailFromWebhook(orderRes, mailData);
        }
      } else {
        utils.writeErrorLog('stripeAccounts', '_fundsInStripe', 'Error while updating stripe charge status', (orderErr || orderRes), dbQueryParams['query']);
      }
    });
  }
}

function _updateMilestomePaymentStatus(webhookObj, status) {
  utils.writeInsideFunctionLog('stripeAccounts', '_updateMilestomePaymentStatus', {'status': status});

  let currentDate = utils.getCurrentDate()(),
    dbQueryParams = {}, updatedData = {}, jobId;

  // if (!status) {
  //   let jobDetails = webhookObj['data']['object']['metadata'];
  //   if (!jobDetails.hasOwnProperty('m_id')) {
  //     _fundsInStripe(webhookObj, constant['PAYMENT_STATUS']['FUND_TRANSFER_SUCCESSFUL']);
  //   } else {
  //     status = constant['PAYMENT_STATUS']['FUND_TRANSFER_SUCCESSFUL']
  //     // add code here
  //   }
  // }
  if (status === constant['DELIVERABLE_STATUS']['PAID']) {
    let jobDetails = webhookObj['data']['object']['metadata'];
    jobId = jobDetails['id'];
    dbQueryParams['query'] = {
      'jobId': jobId,
      'paymentDetails._id': ObjectId(jobDetails['m_id']),
      'paymentDetails.status': constant['DELIVERABLE_STATUS']['RELEASED']
    };
    updatedData = {
      'paymentDetails.$.status': status,
      'updated_at': currentDate
    };
  } else if (status === constant['DELIVERABLE_STATUS']['RELEASED']){
    jobId = webhookObj['jobId'];
    dbQueryParams = {
      'query': {
        'jobId': jobId,
        'paymentDetails._id': ObjectId(webhookObj['m_id']),
        'paymentDetails.status': constant['DELIVERABLE_STATUS']['APPROVED']
      }
    };
    updatedData = {
      'paymentDetails.$.status': status,
      'updated_at': currentDate
    };
  }
  // if (status) {
    nTermsSchema.updateOne(dbQueryParams, updatedData, function(nErr, nRes) {
      if (utils.isObjectNotEmpty(nRes) && nRes['nModified']) {
        dbQueryParams['query'] = {
          'jobId': jobId,
          'status': { '$eq': constant['N_TERMS_STATUS']['ACCEPTED'] }
        };
        nTermsSchema.findQuery(dbQueryParams, function(fErr, fRes) {
          if (fRes && fRes.length) {
            let uRes = fRes[0],
              dataObj = {
              'job_id': uRes['jobId'],
              'seeker_id': uRes['seekerId'],
              'poster_id': uRes['posterId']
            };
            if (status === constant['DELIVERABLE_STATUS']['RELEASED']) {
              let mailData = {
                'subject': 'Milestone Payment Released',
                'poster_mail_body_key': 'PAYMENT_RELEASED_FROM_ESCROW_FOR_POSTER',
                'seeker_mail_body_key': 'PAYMENT_RELEASED_FROM_ESCROW_FOR_SEEKER'
              }
              _sendMailFromWebhook(dataObj, mailData);
            } else if (status === constant['DELIVERABLE_STATUS']['PAID']) {
              let paymentDetails = uRes.paymentDetails;
              if (paymentDetails[paymentDetails.length - 1]['status'] === constant['DELIVERABLE_STATUS']['PAID']) {
                _finalMilestonePaymentReleased(dataObj, uRes);
              }
            }
          } else {
            utils.writeErrorLog('stripeAccounts', '_updateMilestomePaymentStatus', 'Error while getting negotiate term detail', (fErr || fRes), dbQueryParams['query']);
          }
        });
      } else if (nErr) {
        utils.writeErrorLog('stripeAccounts', '_updateMilestomePaymentStatus', 'Error while updating milestone payment status', nErr, dbQueryParams['query']);
      }
    });
  // }
}

function _finalMilestonePaymentReleased(dataObj, nTerms) {
  utils.writeInsideFunctionLog('stripeAccounts', '_finalMilestonePaymentReleased', nTerms);

  let dbQueryParams = {
    'query': {
      'job_id': nTerms['jobId'],
      'status': { '$eq': constant['JOB_STEPS']['IN_PROGRESS'] }
    }
  }
  let updateStatus = {
    'status': constant['JOB_STEPS']['J_COMPLETE'],
    'updated_at': utils.getCurrentDate()()
  }
  jobStatusSchema.updateStatusQuery(dbQueryParams, updateStatus, function(jErr, jRes) {
    if (utils.isObjectNotEmpty(jRes)) {
      logger.info('[stripeAccounts] - Updated Job Status from In Prgress to Job Complete at the time of Final Milestone Payment Paid webhook trigger -->', utils.getStringifyObj(jRes));

      let mailData = {
        'subject': 'Job Completed',
        'poster_mail_body_key': 'JOB_COMPLETED',
        'seeker_mail_body_key': 'JOB_COMPLETED'
      }
      _sendMailFromWebhook(dataObj, mailData);
      _deleteFilesFromBucketAndDeliverables(nTerms);

    } else {
      utils.writeErrorLog('stripeAccounts', '_finalMilestonePaymentReleased', 'Error while updating job status detail', (jErr || jRes), dbQueryParams['query']);
    }
  });
}

function _deleteFilesFromBucketAndDeliverables(nTermsDetails) {
  utils.writeInsideFunctionLog('stripeAccounts', '_deleteFilesFromBucketAndDeliverables', {'_id': nTermsDetails['_id']});

  let filesPathArr = [];
  for (let obj of nTermsDetails['paymentDetails']) {
    filesPathArr.push({'Key': obj['filepath']});
    obj['filepath'] = '';
    obj['filename'] = '';
  }
  profileModel.deleteFiles(filesPathArr, function(err, res) {
    if (err) {
      utils.writeErrorLog('stripeAccounts', '_deleteFilesFromBucketAndDeliverables', 'Error while deleting files from s3 bucket on Job Complete', err);
    } else {
      logger.info('[stripeAccounts] - Files deleted successfully from s3 bucket on Job Complete');

      let dbQueryParams = {
        'query': {
          '_id': nTermsDetails['_id']
        }
      }
      nTermsSchema.updateQuery(dbQueryParams, {'paymentDetails': nTermsDetails['paymentDetails']}, function(nErr, nRes) {
        if (utils.isObjectNotEmpty(nRes)) {
          logger.info('[stripeAccounts] - Files path deleted successfully from database on Job Complete');
        } else {
          utils.writeErrorLog('stripeAccounts', '_deleteFilesFromBucketAndDeliverables', 'Error while updating negotiate term detail', (nErr || nRes), dbQueryParams['query']);
        }
      });
    }
  });
}

function getStripeDashboardLink(req, res, cb) {
  utils.writeInsideFunctionLog('stripeAccounts', 'getStripeDashboard', req['body']);

  let resObj = Object.assign({}, utils.getErrorResObj()), reqBody = req['body'];
  helper.checkUserLoggedIn(req['headers']['token'], function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      let userQueryParams = {
        'query': {'_id': result['_id']}
      };
      if (reqBody['user_id']) {
        userQueryParams['query']['_id'] = reqBody['user_id'];
      }

      userSchema.findQuery(userQueryParams, function(uErr, uRes) {
        if (!!uRes && uRes.length) {
          let freezeActivity = uRes[0]['freeze_activity'];
          if (reqBody['freeze_activity'] && (freezeActivity !== reqBody['freeze_activity'])) {
            resObj['code'] = constant['RES_OBJ']['CODE']['CONFLICT'];
            resObj['message'] = constant['RES_OBJ']['MSG']['CONFLICT'];
            utils.callCB(cb, resObj);
          } else if (freezeActivity){
            resObj['code'] = constant['RES_OBJ']['CODE']['LOCKED'];
            resObj['message'] = constant['RES_OBJ']['MSG']['LOCKED'];
            utils.callCB(cb, resObj);
          } else {
            userQueryParams['query'] = {
              'user_id': result['_id']
            };
            stripeAccSchema.findQuery(userQueryParams, function(sErr, sRes) {
              if (!!sRes && sRes.length) {
                stripe.accounts.createLoginLink(sRes[0]['stripe_user_id'], function(err, link) {
                  if (err) {
                    resObj['code'] = constant['RES_OBJ']['CODE']['FAILED_DEPENDENCY'];
                    resObj['message'] = utils.getStripeErrorMsg(err);
                    utils.callCB(cb, resObj);
                    utils.writeErrorLog('stripeAccounts', 'getStripeDashboardLink', 'Error while getting stripe account link', err, sRes[0]['stripe_user_id']);
                  } else {
                    resObj = Object.assign({}, utils.getSuccessResObj());
                    resObj['data'] = {
                      'url': link['url']
                    };
                    utils.callCB(cb, resObj);
                  }
                });
              } else {
                utils.callCB(cb, resObj);
                utils.writeErrorLog('stripeAccounts', 'getStripeDashboardLink', 'Error while getting stripe account link', (sErr || sRes), userQueryParams['query']);
              }
            });
          }
        } else {
          utils.callCB(cb, resObj);
          utils.writeErrorLog('stripeAccounts', 'getStripeDashboardLink', 'Error while getting stripe account link', (uErr || uRes), userQueryParams['query']);
        }
      });
    }
  });
}

function getCreateStripeAccountLink(req, res, cb) {
  utils.writeInsideFunctionLog('stripeAccounts', 'getCreateStripeAccountLink', req['body']);

  let resObj = Object.assign({}, utils.getErrorResObj()),
    reqBody = req['body'],
    role = constant['ROLE']['SEEKER'],
    stripeClientId = config['stripe']['client_id'],
    jobId = reqBody['job_id'];
  helper.checkUserLoggedIn(req['headers']['token'], function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      let userQueryParams = {
        'query': {'_id': result['_id']}
      };
      if (reqBody['user_id']) {
        userQueryParams['query']['_id'] = reqBody['user_id'];
        role = constant['ROLE']['POSTER'];
      }

      userSchema.findQuery(userQueryParams, function(uErr, uRes) {
        if (!!uRes && uRes.length) {
          let freezeActivity = uRes[0]['freeze_activity'];
          if (freezeActivity !== reqBody['freeze_activity']) {
            resObj['code'] = constant['RES_OBJ']['CODE']['CONFLICT'];
            resObj['message'] = constant['RES_OBJ']['MSG']['CONFLICT'];
            utils.callCB(cb, resObj);
          } else if (freezeActivity){
            resObj['code'] = constant['RES_OBJ']['CODE']['LOCKED'];
            resObj['message'] = constant['RES_OBJ']['MSG']['LOCKED'];
            utils.callCB(cb, resObj);
          } else {
            resObj = Object.assign({}, utils.getSuccessResObj());
            resObj['data'] = {
              'url': `https://connect.stripe.com/express/oauth/authorize?client_id=${stripeClientId}&state=${role}_${jobId}`
            };
            utils.callCB(cb, resObj);
          }
        } else {
          utils.callCB(cb, resObj);
          utils.writeErrorLog('stripeAccounts', 'getCreateStripeAccountLink', 'Error while getting stripe account link', (uErr || uRes), userQueryParams['query']);
        }
      });
    }
  });
}

function realeaseFund(req, res, cb) {
  utils.writeInsideFunctionLog('stripeAccounts', 'realeaseFund', req['body']);

  let resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req['headers']['token'], function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      let jobId = req['body']['job_id'],
        milestone = req['body']['milestone'],
        milestone_id = req['body']['milestone_id'];
      if(jobId && milestone && milestone_id) {
        let dbQueryParams = {
          'query': {
            'jobId': jobId,
            'status': { '$eq': constant['N_TERMS_STATUS']['ACCEPTED'] }
          }
        }
        nTermsSchema.findQuery(dbQueryParams, function(nErr, nRes) {
          if (!!nRes && nRes.length) {
            let obj = nRes[0]['paymentDetails'].find(function(item) {
              return (item['milestone'] === milestone && item['_id'].toString() === milestone_id);
            });
            let data = {
              'jobId': jobId,
              'userId': nRes[0]['posterId'],
              'status': constant['PAYMENT_STATUS']['FUND_TRANSFER_SUCCESSFUL']
            }
            stripeChargeSchema.findDetails(data, function(cErr, cRes) {
              if (cRes && cRes.length > 0 && cRes[0]['seeker_details'] && cRes[0]['seeker_details'].length > 0) {
                stripe.transfers.create({
                  amount: obj['rate'] * constant['CENT_TO_DOLLAR'],
                  currency: 'usd',
                  source_transaction: cRes[0]['stripe_charge_id'],
                  destination: cRes[0]['seeker_details'][0]['stripe_user_id'],
                  description: 'Charge for ' + jobId,
                  metadata: {'id': jobId, m_id: obj['_id'].toString()}
                }).then(function(transfer) {
                  resObj = Object.assign({}, utils.getSuccessResObj());
                  let milestoneData = {
                    'jobId': jobId,
                    'm_id': obj['_id'].toString()
                  };
                 _updateMilestomePaymentStatus(milestoneData, constant['DELIVERABLE_STATUS']['RELEASED']);
                  utils.callCB(cb, resObj);
                }, function(stripeErr) {
                  resObj['code'] = constant['RES_OBJ']['CODE']['FAILED_DEPENDENCY'];
                  resObj['message'] = utils.getStripeErrorMsg(stripeErr);
                  utils.callCB(cb, resObj);
                });
              } else {
                utils.callCB(cb, resObj);
                utils.writeErrorLog('stripeAccounts', 'realeaseFund', 'Error while stripe account details', (cErr || cRes), data);
              }
            });
          } else {
            utils.callCB(cb, resObj);
            utils.writeErrorLog('stripeAccounts', 'realeaseFund', 'Error while getting negotiate terms detail', (nErr || nRes), dbQueryParams['query']);
          }
        });
      } else {
        resObj['message'] = constant['INVALID_PARAMETER'];
        utils.callCB(cb, resObj);
      }
    }
  });
}

module.exports =  {
  setStripeAccountInfo,
  transferFunds,
  getReleaseFundUrl,
  getSetPreferencesStatus,
  webhook,
  getStripeDashboardLink,
  getCreateStripeAccountLink,
  realeaseFund
}
