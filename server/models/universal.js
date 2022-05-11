'use strict';

var rfr = require('rfr'),
  async = require('async'),
  fs = require('fs');

var config = rfr('/server/shared/config'),
  constant = rfr('/server/shared/constant'),
  mailHelper = rfr('/server/shared/mailHelper'),
  utils = rfr('/server/shared/utils');

var validator = rfr('/server/models/shared/validator'),
  helper = rfr('/server/models/shared/helper');

var categoryModel = rfr('/server/models/static/categories'),
  degreeModel = rfr('/server/models/static/degrees'),
  employmentTypeModel = rfr('/server/models/static/employmentTypes'),
  practiceAreaModel = rfr('/server/models/static/practiceAreas'),
  skillModel = rfr('/server/models/static/skills'),
  stateModel = rfr('/server/models/static/states'),
  workLocationModel = rfr('/server/models/static/workLocations'),
  fedTaxClassificationsModel = rfr(
    '/server/models/static/fedTaxClassifications'
  ),
  jobTypeModel = rfr('/server/models/static/jobTypes'),
  paymentTypeModel = rfr('/server/models/static/paymentTypes');

var postJobSchema = rfr('/server/schemas/ddl/postJobs'),
  userSchema = rfr('/server/schemas/ddl/users');

/**
 * @method contactUs
 * @used Contact Us
 * @param object req, object res.
 * @return object res.
 * @author KTI0591
 */
function contactUs(req, res, callback) {
  utils.writeInsideFunctionLog('universal', 'contactUs');

  let reqBody = req.body;
  if (
    !!reqBody.first_name &&
    !!reqBody.last_name &&
    !!reqBody.subject &&
    !!reqBody.email &&
    !!reqBody.message
  ) {
    if (
      validator.alphaWithDashOnly(reqBody.first_name) &&
      validator.maxLength(reqBody.first_name, 50, true) &&
      validator.alphaWithDashOnly(reqBody.last_name) &&
      validator.maxLength(reqBody.last_name, 50, true) &&
      validator.emailValidation(reqBody.email) &&
      validator.maxLength(reqBody.subject, 50, true) &&
      validator.maxLength(reqBody.message, 1000, true)
    ) {
      let mailObj = {
        firstName: reqBody.first_name.trim(),
        lastName: reqBody.last_name.trim(),
        subject: reqBody.subject.trim(),
        message: reqBody.message.trim(),
        email: reqBody.email.trim()
      };

      config.mailOptions.to = constant['MAIL_OBJ']['SUPPORT_ID'];
      config.mailOptions.subject = `${mailObj['firstName']} ${mailObj['lastName']} | Legably Support Center`;
      config.mailOptions.html = mailHelper.getMailTmpl(
        'CONTACT_US_FOR_SUPPORT',
        mailObj
      );
      config.mailOptions.email = mailObj['email'];

      // send mail with defined transport object
      config.transporter.sendMail(config.mailOptions, (error, info) => {
        if (error) {
          callback({
            Code: 400,
            Status: false,
            Message: constant['OOPS_ERROR']
          });
          utils.writeErrorLog(
            'universal',
            'contactUs',
            'Error while sending email to Legably',
            error,
            { email: constant['MAIL_OBJ']['SUPPORT_ID'] }
          );
        } else {
          config.mailOptions.to = mailObj['email']; // For dynamic list of recievers
          config.mailOptions.subject =
            "We received your message! Here's what to expect next...";
          config.mailOptions.html = mailHelper.getMailTmpl(
            'CONTACT_US_FOR_USER',
            mailObj
          );

          // send mail with defined transport object
          config.transporter.sendMail(config.mailOptions, (error, info) => {
            if (error) {
              callback({
                Code: 400,
                Status: false,
                Message: constant['OOPS_ERROR']
              });
              utils.writeErrorLog(
                'universal',
                'contactUs',
                'Error while sending email to User',
                error,
                { email: mailObj['email'] }
              );
            } else {
              callback({
                Code: 200,
                Status: true,
                Message: constant['SENT_CONTACTUS_MAIL']
              });
            }
          });
        }
      });
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
      Message: constant['EMPTY_FIELD_ERROR']
    });
  }
}

function getAllListsData(req, res, callback) {
  utils.writeInsideFunctionLog('universal', 'getAllListsData');

  var listsObj = {
    categories: categoryModel,
    degrees: degreeModel,
    employment_types: employmentTypeModel,
    practice_areas: practiceAreaModel,
    skills: skillModel,
    states: stateModel,
    work_locations: workLocationModel,
    fed_tax_classifications: fedTaxClassificationsModel,
    job_types: jobTypeModel,
    payment_types: paymentTypeModel
  };
  var resObj = Object.assign({}, utils.getSuccessResObj());
  resObj['data'] = {};

  async.forEachOf(
    listsObj,
    (value, key, cb) => {
      value.get(req, res, result => {
        if (result['code'] !== constant['RES_OBJ']['CODE']['SUCCESS']) {
          return cb('Error in ' + key);
        }
        resObj['data'][key] = result['data'][key];
        cb();
      });
    },
    err => {
      if (err) {
        resObj = Object.assign({}, utils.getErrorResObj());
        utils.writeErrorLog(
          'universal',
          'getAllListsData',
          'Error while getting dropdown data',
          err
        );
      }
      callback(resObj);
    }
  );
}

function sendMsg(req, res, cb) {
  utils.writeInsideFunctionLog('universal', 'sendMsg');

  let resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req.headers.token, function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      let reqBody = req['body'];
      let subject = reqBody['subject'];
      let message = reqBody['message'];
      subject && (subject = subject.trim());
      message && (message = message.trim());
      let jobId = reqBody['jobId'];
      let role = reqBody['role'];
      let fileObj = reqBody['file'];
      if (!!subject && !!message && !!role && !!jobId) {
        if (!!fileObj && Object.keys(fileObj).length) {
          let validateFileObj = validator.validateFile('attachments', fileObj);
          if (!validateFileObj['isValidFile']) {
            resObj['message'] = error;
            utils.callCB(cb, resObj);
            return;
          } else {
            config.mailOptions.attachments = [];
            config.mailOptions.attachments.push({
              filename: reqBody['file']['name'],
              path: reqBody['file']['dataUrl']
            });
          }
        }
        let mailObj = {
          senderFirstName: result['first_name'],
          senderLastName: result['last_name'],
          msg: message,
          role: role
        };
        let dbQueryParam = {
          query: { _id: jobId }
        };
        postJobSchema.findQuery(dbQueryParam, function(pErr, pResult) {
          if (pResult.length > 0) {
            mailObj['jobName'] = utils.toTitleCase(pResult[0]['jobHeadline']);
            let receiverId = reqBody['seekerId'];
            if (role === constant['ROLE']['SEEKER']) {
              receiverId = pResult[0]['userId'];
            }
            dbQueryParam['query'] = { _id: receiverId };
            userSchema.findQuery(dbQueryParam, function(uErr, uResult) {
              if (uResult.length > 0) {
                mailObj['receiverFirstName'] = uResult[0]['first_name'];
                mailObj['receiverLastName'] = uResult[0]['last_name'];

                if (reqBody['isInvite']) {
                  mailObj['msg'] = mailHelper.getInviteMsgWithLink(
                    reqBody['message'],
                    reqBody['jobId'],
                    mailObj['jobName']
                  );
                }

                config.mailOptions.to = uResult[0]['email'];
                config.mailOptions.subject = `${subject} | ${constant['MAIL_OBJ']['SUBJECT_FRAGMENT']}`;
                config.mailOptions.html = mailHelper.getMailTmpl(
                  'SEND_MESSAGE',
                  mailObj
                );
                // send mail with defined transport object
                config.transporter.sendMail(
                  config.mailOptions,
                  (error, info) => {
                    if (error) {
                      utils.callCB(cb, resObj);
                      utils.writeErrorLog(
                        'universal',
                        'sendMsg',
                        'Error while sending email',
                        error,
                        { email: uResult[0]['email'] }
                      );
                    } else {
                      resObj = Object.assign(
                        { data: {} },
                        utils.getSuccessResObj()
                      );
                      utils.callCB(cb, resObj);
                    }
                    config.mailOptions.attachments = [];
                  }
                );
              } else {
                utils.callCB(cb, resObj);
                utils.writeErrorLog(
                  'universal',
                  'sendMsg',
                  'Error while getting user detail',
                  uErr || uResult,
                  dbQueryParam['query']
                );
              }
            });
          } else {
            utils.callCB(cb, resObj);
            utils.writeErrorLog(
              'universal',
              'sendMsg',
              'Error while getting job detail',
              pErr || pResult,
              dbQueryParam['query']
            );
          }
        });
      } else {
        resObj['message'] = constant['EMPTY_FIELD_ERROR'];
        utils.callCB(cb, resObj);
      }
    }
  });
}

function getLogFile(req, res, cb) {
  let resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req.params.token, function(err, result = {}) {
    if (err || result['role'] !== 'admin') {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      let file = `server/logs/${req.params.fileName}`;
      if (fs.existsSync(file)) {
        res.download(file);
      } else {
        resObj['message'] = constant['INVALID_PARAMETER'];
        utils.callCB(cb, resObj);
      }
    }
  });
}

module.exports = {
  contactUs,
  getAllListsData,
  sendMsg,
  getLogFile
};
