'use strict';

var rfr = require('rfr'),
Guid = require('guid'),
fs = require('fs'),
path = require('path'),
async = require('async'),
_ = require('underscore'),
mongoose = require('mongoose'),
users = mongoose.model('users'),
employment_types = mongoose.model('employment_types');

var config = rfr('/server/shared/config'),
constant = rfr('/server/shared/constant'),
logger = rfr('/server/shared/logger'),
utils = rfr('/server/shared/utils');

var helper = rfr('/server/models/shared/helper'),
validator = rfr('/server/models/shared/validator');

var AWS = require('aws-sdk');
AWS.config.accessKeyId = config.aws.key;
AWS.config.secretAccessKey = config.aws.secret;
var s3Bucket = new AWS.S3({params: {Bucket: config.aws.bucket}});

/**
   * @method _updateUserProfile
   * @used For Logout
   * @param string token, integer currentStep, object req, object res.
   * @return object res.
   * @author KTI0591
*/
function _removeBucketUrlFromSavedObj(obj) {
  let pattern = config.bucketUrl,
  regExp = new RegExp(pattern, "g");
  let str = utils.getStringifyObj(obj).replace(regExp, "");
  return JSON.parse(str);
}

/**
   * @method _updateUserProfile
   * @used For Logout
   * @param string token, integer currentStep, object req, object res.
   * @return object res.
   * @author KTI0591
*/
function _updateUserProfile(token, currentStep, userType, from, req, res, callback) {
  utils.writeInsideFunctionLog('profile', '_updateUserProfile', {'from': from});

  helper.checkUserLoggedIn(token , function(err, result){
    if(err){
      callback({Code:401, Status:false, Message:err});
    }else{
      if(result[userType].last_visited_page != 5 && currentStep > result[userType].last_visited_page){
        req.body[userType].last_visited_page = currentStep;
      }else{
        req.body[userType].last_visited_page = result[userType].last_visited_page;
      }
      users.findProfile(result._id, userType, from, req.body[userType][from], req.body[userType].last_visited_page, function(fErr, fRes){
        if (fErr) {
          callback({Code:400, Status:false, Message:constant['OOPS_ERROR']});
          utils.writeErrorLog('profile', '_updateUserProfile', 'Error while getting user detail', fErr, {'_id': result._id});
        } else {
          if(currentStep == 1){
            fRes.first_name = req.body.first_name;
            fRes.last_name = req.body.last_name;
          }
          fRes.updated_at = utils.getCurrentDate()();
          users.updateProfile(result._id, fRes, function(uErr, uRes){
            if (uErr) {
              callback({Code:400, Status:false, Message:constant['OOPS_ERROR']});
              utils.writeErrorLog('profile', '_updateUserProfile', 'Error while updating user detail', uErr, {'_id': result._id});
            } else {
              callback({Code:200, Status:true, Message:constant['SUCCESS_UPDATE_PROFILE']});
            }
          })
        }
      })
    }
  })
}

/**
   * @method _deleteFile
   * @used For delete file from folder
   * @param string directory Folder path.
   * @author KTI0591
*/

function _deleteFile(directory) {
  utils.writeInsideFunctionLog('profile', '_deleteFile', {'directory': directory});

  var params = {
    Key: directory
  };
  s3Bucket.deleteObject(params, function (err, data) {
    if (data) {
      logger.info("[profile] - File deleted successfully from s3 Bucket");
    } else {
      utils.writeErrorLog('profile', '_deleteFile', 'Error while deleting file from s3 Bucket', err, params);
    }
  });
}

function deleteFiles(fileArr, cb) {
  utils.writeInsideFunctionLog('profile', 'deleteFiles', {'fileArr': fileArr});

  var params = {
    Delete: {
      Objects: fileArr
    }
  };
  s3Bucket.deleteObjects(params, function (err, data) {
    if (data) {
      cb(null, data);
      logger.info("[profile] - Files deleted successfully from s3 Bucket");
    } else {
      cb(err);
      utils.writeErrorLog('profile', 'deleteFiles', 'Error while deleting files from s3 Bucket', err, params);
    }
  });
}

function _uploadFileOnAWS(fileName, encodedData, cb) {
  var sampleBuffer = new Buffer(encodedData, 'base64');
  var uploadObj = {
    ACL: 'public-read',
    Key: fileName,
    Body: sampleBuffer,
    ContentEncoding: 'base64'
  }
  s3Bucket.upload(uploadObj, function (err, data) {
    if (err) {
      cb(constant['UPLOAD_ERROR']);
      utils.writeErrorLog('profile', '_uploadFileOnAWS', 'Error while uploading file on s3 Bucket', err);
    } else {
      cb(null, data);
    }
  });
}

/**
   * @method _uploadSamples
   * @used For upload sample file in public/uploaded_files/writingSamples/
   * @param object writingSamples, string userId, function callback.
   * @return function callback.
   * @author KTI0591
*/
function _uploadSamples(writingSamples, userId, callback) {
  utils.writeInsideFunctionLog('profile', '_uploadSamples');

  var samplesFile = [];
  async.each(writingSamples,
    function(sample, callback) {
      var fileObj = validator.returnFileExtAndSize(sample);
      var fileName = "writing-samples/" + userId + "/" + sample['name'];
      var file = config.fileUploadPath + "/writingSamples/" + userId + "/" + sample['name']; // DESTINATION WHERE WE WANT TO UPLOAD FILE
      var validFormats = ['pdf', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'msword'];
      if (validFormats.indexOf(fileObj['ext']) !== -1) {
        _uploadFileOnAWS(fileName, fileObj['encodedData'], function(err, data) {
          if (err) {
            callback(err);
          } else {
            samplesFile.push({
              name: sample['name'],
              path: fileName
            });
            callback(null, fileName);
          }
        });
      } else {
        callback(constant['INVALID_FILE_FORMAT']);
      }
    },
    function(err, file) {
      if (err) {
        callback(err);
        utils.writeErrorLog('profile', '_uploadSamples', 'Error while uploading writing samples', err);
      } else {
        callback(null, samplesFile);
      }
    }
  );
}

/**
   * @method _uploadFile
   * @used For uplaod file in public/uploaded_files/
   * @param string from, object fileObj, string userId, function callback.
   * @return function callback.
   * @author KTI0591
*/

function _uploadFile(from, fileObj, userId, callback) {
  utils.writeInsideFunctionLog('profile', '_uploadFile', {'from': from});

  if (!!fileObj) {
    var validateFileObj = validator.validateFile(from, fileObj);
    if (validateFileObj['isValidFile']) {
      var fileName = from + "/" + userId + "/" + fileObj['name'];
      if (from === 'deliverables') {
        var modifiedFilename = utils.getCurrentDate()() + '-' + fileObj['name'];
        fileName = from + "/user-" + userId + "/job-" + fileObj['jobId'] + "/" + modifiedFilename;
      }
      _uploadFileOnAWS(fileName, validateFileObj['file']['encodedData'], function(err, data) {
        if (err) {
          callback(err);
        } else {
          callback(null, fileName);
        }
      });
    } else {
      callback(validateFileObj['msg']);
    }
  } else{
    callback(constant['INVALID_PARAMETER']);
  }
}

/**
   * @method getUserProfile
   * @used For getting user details from database
   * @param object req, object res.
   * @return object res.
   * @author KTI0591
*/
function getUserProfile(req, res, callback) {
  utils.writeInsideFunctionLog('profile', 'getUserProfile', req['params']);

  if (!!req.headers.token) {
    helper.checkUserLoggedIn(req.headers.token , function(err, result) {
      if (err) {
        callback({Code: 401, Status: false, Message: err});
      } else {
        let userId = req.params.userId;
        if (userId) {
          if (userId === 'attorney' || userId === 'firm') {
            helper.checkBasicInfo(result, req.params.forUser, req.params.fromUser, function(resultData) {
              callback({Code: 200, Status: true, Message: constant['REQUEST_OK'], Data: resultData});
            });
          } else {
            if (mongoose.Types.ObjectId.isValid(userId)) {
              var query = {
                '_id': userId
              }
              users.findOneQuery(query, function(error, result) {
                if (error) {
                  callback({Code: 400, Status: false, Message: constant['OOPS_ERROR']});
                  utils.writeErrorLog('profile', 'getUserProfile', 'Error while getting user detail', error, query);
                } else {
                  if (result) {
                    callback({Code: 200, Status: true, Message: constant['REQUEST_OK'], Data: result});
                  } else {
                    callback({Code: 400, Status: false, Message: constant['NO_RESOURCE_FOUND']});
                  }
                }
              });
            } else {
              callback({Code: 400, Status: false, Message: constant['NO_RESOURCE_FOUND']});
            }
          }
        } else {
          helper.checkBasicInfo(result, req.params.forUser, req.params.fromUser, function(resultData) {
            callback({Code: 200, Status: true, Message: constant['REQUEST_OK'], Data: resultData});
          });
        }
      }
    });
  } else {
    callback({Code: 400, Status: false, Message: constant['AUTH_FAIL']});
  }
}

/**
   * @method basicProfile
   * @used For saving basic profile details of user
   * @param object req, object res.
   * @return object res.
   * @author KTI0591
*/
function basicProfile(req, res, callback) {
  utils.writeInsideFunctionLog('profile', 'basicProfile');

  if(!!req.headers.token && !!req.body.first_name && !!req.body.last_name && !!req.body.job_seeker_info.basic_profile.basic_info.street_address && !!req.body.job_seeker_info.basic_profile.basic_info.city && !!req.body.job_seeker_info.basic_profile.basic_info.state_id && !!req.body.job_seeker_info.basic_profile.basic_info.zipcode && !!req.body.job_seeker_info.basic_profile.basic_info.phone_number && !!req.body.job_seeker_info.basic_profile.practice_area_id && req.body.job_seeker_info.basic_profile.do_you_have_malpractice_insurance){
    var eduCount = 0;
    var barCount = 0;
    if(!!req.body.job_seeker_info.basic_profile.education){
      for(var i=0; i<req.body.job_seeker_info.basic_profile.education.length; i++){
        if(!!req.body.job_seeker_info.basic_profile.education[i].school && !!req.body.job_seeker_info.basic_profile.education[i].degree_id && !!req.body.job_seeker_info.basic_profile.education[i].year){
          if(validator.maxLength(req.body.first_name, 50 ,true) && validator.maxLength(req.body.last_name, 50 ,true) && validator.maxLength(req.body.job_seeker_info.basic_profile.basic_info.street_address, 250 ,true) && validator.maxLength(req.body.job_seeker_info.basic_profile.education[i].year, 4 ,true) && validator.minLength(req.body.job_seeker_info.basic_profile.education[i].year, 4, true) && validator.maxLength(req.body.job_seeker_info.basic_profile.education[i].education_additional_information, 250, false)){
            eduCount++;
          }else{
            callback({Code:400, Status:false, Message:constant['INVALID_FORMAT']});
          }
        }else{
          callback({Code:400, Status:false, Message:constant['EMPTY_FIELD_ERROR']});
        }
      }
    }else{
      callback({Code:400, Status:false, Message:constant['INVALID_PARAMETER']});
    }
    if(!!req.body.job_seeker_info.basic_profile.bar_admission){
      for(var i=0; i<req.body.job_seeker_info.basic_profile.bar_admission.length; i++){
        if(!!req.body.job_seeker_info.basic_profile.bar_admission[i].bar_registration_number && validator.maxLength(req.body.job_seeker_info.basic_profile.bar_admission[i].bar_registration_number, 15, true)){
          barCount++;
        }else{
          callback({Code:400, Status:false, Message:constant['INVALID_FORMAT']});
        }
      }
    }else{
      callback({Code:400, Status:false, Message:constant['INVALID_PARAMETER']});
    }

    if(eduCount == req.body.job_seeker_info.basic_profile.education.length && barCount == req.body.job_seeker_info.basic_profile.bar_admission.length ){
      if(validator.alphaWithDashOnly(req.body.first_name) && validator.alphaWithDashOnly(req.body.last_name)){
        if(validator.maxLength(req.body.job_seeker_info.basic_profile.basic_info.zipcode, 5,true) && validator.minLength(req.body.job_seeker_info.basic_profile.basic_info.zipcode, 5,true) && validator.maxLength(req.body.job_seeker_info.basic_profile.basic_info.phone_number, 12, true) && validator.minLength(req.body.job_seeker_info.basic_profile.basic_info.phone_number, 12,true)){
          _updateUserProfile(req.headers.token , 1, "job_seeker_info","basic_profile", req, res, callback);
        }else{
          callback({Code:400, Status:false, Message:constant['INVALID_FORMAT']});
        }
      }
      else{
        callback({Code:400, Status:false, Message:constant['INVALID_FORMAT']});
      }
    }else{
      callback({Code:400, Status:false, Message:constant['INVALID_FORMAT']});
    }
  }else{
    callback({Code:400, Status:false, Message:constant['EMPTY_FIELD_ERROR']});
  }
}

/**
   * @method experienceProfile
   * @used For saving experience profile details of user.
   * @param object req, object res.
   * @return object res.
   * @author KTI0591
*/
function experienceProfile(req, res, callback) {
  utils.writeInsideFunctionLog('profile', 'experienceProfile');

  if(!!req.headers.token && !!req.body.job_seeker_info.experience){
    if(req.body.job_seeker_info.experience.length == 0){
      _updateUserProfile(req.headers.token , 2, "job_seeker_info","experience", req, res, callback);
    }else{
      req.body.job_seeker_info.experience = _.sortBy(req.body.job_seeker_info.experience, function(o) {
        var dt = new Date(o.start_date).getTime();
        return -dt;
      });
      var expCount = 0;
      var currentDate = utils.getCurrentDate()();
      for(var i=0; i<req.body.job_seeker_info.experience.length; i++) {
        if (!!req.body.job_seeker_info.experience[i].company_name || !!req.body.job_seeker_info.experience[i].designation || req.body.job_seeker_info.experience[i].employment_type_id.length > 0 || req.body.job_seeker_info.experience[i].skill_used_id.length > 0 || !!req.body.job_seeker_info.experience[i].experience_additional_information){
          if (validator.maxLength(req.body.job_seeker_info.experience[i].company_name, 100, false) && validator.maxLength(req.body.job_seeker_info.experience[i].designation, 100, false) && validator.maxLength(req.body.job_seeker_info.experience[i].experience_additional_information, 250, false)){
            if (!!req.body.job_seeker_info.experience[i].start_date && !!req.body.job_seeker_info.experience[i].end_date){
              var startDate = new Date(req.body.job_seeker_info.experience[i].start_date).getTime();
              var endDate =  new Date(req.body.job_seeker_info.experience[i].end_date).getTime();
              if ((startDate <= endDate) && (endDate <= currentDate)) {
                expCount++;
              } else {
                callback({Code:400, Status:false, Message:constant['DATE_ERROR']});
              }
            } else {
              expCount++;
            }
          } else {
            callback({Code:400, Status:false, Message:constant['INVALID_FORMAT']});
          }
        } else {
          req.body.job_seeker_info.experience.splice(i, 1);
          i--;
        }
      }
      if(expCount == req.body.job_seeker_info.experience.length){
        _updateUserProfile(req.headers.token, 2, "job_seeker_info", "experience", req, res, callback);
      }else{
        callback({Code:400, Status:false, Message:constant['OOPS_ERROR']});
      }

    }
  }else{
    callback({Code:400, Status:false, Message:constant['INVALID_PARAMETER']});
  }
}

/**
   * @method networkProfile
   * @used For saving network profile details of user
   * @param object req, object res.
   * @return object res.
   * @author KTI0591
*/
function networkProfile(req, res, callback) {
  utils.writeInsideFunctionLog('profile', 'networkProfile');

  if(!!req.headers.token) {
    helper.checkUserLoggedIn(req.headers.token , function(loginErr, result){
    if(loginErr){
      callback({Code:401, Status:false, Message:loginErr});
    } else{
      var userId = result._id;
      var change_job_seeker_info = _removeBucketUrlFromSavedObj(req.body.job_seeker_info);
      req.body.job_seeker_info = change_job_seeker_info;

      if(validator.maxLength(req.body.job_seeker_info.network.lawyer_headline , 150, false) && validator.maxLength(req.body.job_seeker_info.network.about_lawyer, 700, false) ){
        if(validator.linkedinLinkValidation(req.body.job_seeker_info.network.linkedin_link, false)){
          if (req.body.job_seeker_info.network.deletePhotoLink) {
            _deleteFile(req.body.job_seeker_info.network.deletePhotoLink);
          }
          if(req.body.job_seeker_info.network.photo.hasOwnProperty("dataUrl")){
            _uploadFile('photo',req.body.job_seeker_info.network.photo, userId, function(error, success){
              if(error){
                callback({Code:400, Status:false, Message:error});
              }else{
                var path = success.replace(config.fileUploadPath , config.hostPath+"/uploaded_files");
                req.body.job_seeker_info.network.photo = path;
                if(req.body.job_seeker_info.network.resume.hasOwnProperty("dataUrl")){
                  _uploadFile('resume',req.body.job_seeker_info.network.resume,userId, function(err, succ){
                    if(err){
                      callback({Code:400, Status:false, Message:err});
                    }else{

                      req.body.job_seeker_info.network.resume = succ;
                      if(req.body.job_seeker_info.network.writing_samples.length > 0){
                        _uploadSamples(req.body.job_seeker_info.network.writing_samples, userId, function(Error, Success){
                          if(Error){
                            callback({Code:400, Status:false, Message:Error});
                          }else{
                            req.body.job_seeker_info.network.writing_samples = Success;
                            req.body.job_seeker_info.network.writing_samples = req.body.job_seeker_info.network.writing_samples.concat(req.body.job_seeker_info.network.alreadyAddedSample);
                            _updateUserProfile(req.headers.token , 3 , "job_seeker_info","network", req, res, callback);
                          }
                        })
                      }else{
                        req.body.job_seeker_info.network.writing_samples = req.body.job_seeker_info.network.writing_samples.concat(req.body.job_seeker_info.network.alreadyAddedSample);
                        _updateUserProfile(req.headers.token , 3, "job_seeker_info", "network", req, res, callback);
                      }
                    }
                  })
                }else{
                  if(!req.body.job_seeker_info.network.resumeUpdate){
                    //delete req.body.job_seeker_info.network.resume;
                  }else{
                    //_deleteFile(config.fileUploadPath +"/resume/"+userId+'/');
                    req.body.job_seeker_info.network.resume = '';
                  }
                  if(req.body.job_seeker_info.network.writing_samples.length > 0){
                    _uploadSamples(req.body.job_seeker_info.network.writing_samples, userId, function(Error, Success){
                      if(Error){
                        callback({Code:400, Status:false, Message:Error});
                      }else{
                        req.body.job_seeker_info.network.writing_samples = Success;
                        req.body.job_seeker_info.network.writing_samples = req.body.job_seeker_info.network.writing_samples.concat(req.body.job_seeker_info.network.alreadyAddedSample);
                        _updateUserProfile(req.headers.token , 3, "job_seeker_info", "network", req, res, callback);
                      }
                    })
                  }else{
                    req.body.job_seeker_info.network.writing_samples = req.body.job_seeker_info.network.writing_samples.concat(req.body.job_seeker_info.network.alreadyAddedSample);
                    _updateUserProfile(req.headers.token , 3, "job_seeker_info", "network", req, res, callback);
                  }
                }
              }
            })
          }else{
            if(!req.body.job_seeker_info.network.photoUpdate){
              //delete req.body.job_seeker_info.network.photo;
            }else{
              req.body.job_seeker_info.network.photo = "";
            }
            if(req.body.job_seeker_info.network.resume.hasOwnProperty("dataUrl")){
              _uploadFile('resume',req.body.job_seeker_info.network.resume, userId,function(err, succ){
                if(err){
                    callback({Code:400, Status:false, Message:err});
                  }else{
                    req.body.job_seeker_info.network.resume = succ;
                    if(req.body.job_seeker_info.network.writing_samples.length > 0){
                      _uploadSamples(req.body.job_seeker_info.network.writing_samples,userId, function(Error, Success){
                        if(Error){
                          callback({Code:400, Status:false, Message:Error});
                        }else{
                          req.body.job_seeker_info.network.writing_samples = Success;
                          req.body.job_seeker_info.network.writing_samples = req.body.job_seeker_info.network.writing_samples.concat(req.body.job_seeker_info.network.alreadyAddedSample);
                          _updateUserProfile(req.headers.token , 3, "job_seeker_info", "network", req, res, callback);
                        }
                      })
                    }else{
                      req.body.job_seeker_info.network.writing_samples = req.body.job_seeker_info.network.writing_samples.concat(req.body.job_seeker_info.network.alreadyAddedSample);
                      _updateUserProfile(req.headers.token , 3, "job_seeker_info", "network", req, res, callback);
                    }
                  }
              })
            }else{
              if(!req.body.job_seeker_info.network.resumeUpdate){
                //delete req.body.job_seeker_info.network.resume;
              }else{
                if (req.body.job_seeker_info.network.deleteResumeLink) {
                  _deleteFile(req.body.job_seeker_info.network.deleteResumeLink);
                }
                req.body.job_seeker_info.network.resume = '';
              }
              if(req.body.job_seeker_info.network.writing_samples.length > 0){
                _uploadSamples(req.body.job_seeker_info.network.writing_samples,userId, function(Error, Success){
                  if(Error){
                    callback({Code:400, Status:false, Message:Error});
                  }else{
                    req.body.job_seeker_info.network.writing_samples = Success;
                    req.body.job_seeker_info.network.writing_samples = req.body.job_seeker_info.network.writing_samples.concat(req.body.job_seeker_info.network.alreadyAddedSample);
                    _updateUserProfile(req.headers.token , 3, "job_seeker_info", "network", req, res, callback);
                  }
                })
              }else{
                req.body.job_seeker_info.network.writing_samples = req.body.job_seeker_info.network.writing_samples.concat(req.body.job_seeker_info.network.alreadyAddedSample);
                _updateUserProfile(req.headers.token , 3, "job_seeker_info", "network", req, res, callback);
              }
            }
          }
        }else{
          callback({Code:400, Status:false, Message:constant['INVALID_LINKEDIN_LINK']});
        }
      }
      else {
        callback({Code:400, Status:false, Message:constant['INVALID_FORMAT']});
      }
    }

  });

  } else{
      callback({Code:400, Status:false, Message:constant['INVALID_PARAMETER']});
  }
}

/**
   * @method jobProfile
   * @used For saving job profile details of user
   * @param object req, object res.
   * @return object res.
   * @author KTI0591
*/
function jobProfile(req, res, callback) {
  utils.writeInsideFunctionLog('profile', 'jobProfile');

  if(!!req.headers.token){
    if((req.body.job_seeker_info.job_profile.willing_to_work_locally == 'Y' && req.body.job_seeker_info.job_profile.willing_to_work_location_id.length > 0)|| req.body.job_seeker_info.job_profile.willing_to_work_locally == 'N'){
      if(!!req.body.job_seeker_info.job_profile.desired_job_type){
        async.each(req.body.job_seeker_info.job_profile.desired_job_type,
          function(desired_job_type, callback){
              employment_types.findJobType(desired_job_type.employment_type_id , function(err, result){
              if(err){
                callback(constant['OOPS_ERROR']);
                utils.writeErrorLog('profile', 'jobProfile', 'Error while getting employment type', err, {'_id': desired_job_type.employment_type_id});
              }else{
                if(result){
                  if(result.name == "Permanent"){
                    desired_job_type.min_amount = parseInt(desired_job_type.min_amount);
                    desired_job_type.max_amount = parseInt(desired_job_type.max_amount);
                    if((desired_job_type.min_amount >= 50000 && desired_job_type.min_amount <=200000) && (desired_job_type.max_amount >= desired_job_type.min_amount && desired_job_type.max_amount <= 200000)){
                      callback();
                    } else{
                      callback(constant['INVALID_AMT']);
                    }
                  }
                  else if(result.name == "Contract"){
                    desired_job_type.min_amount = parseInt(desired_job_type.min_amount);
                    desired_job_type.max_amount = parseInt(desired_job_type.max_amount);
                    if((desired_job_type.min_amount >= 0 && desired_job_type.min_amount <=2000) && (desired_job_type.max_amount >= desired_job_type.min_amount && desired_job_type.max_amount <= 2000)){
                      callback();
                    } else{
                      callback(constant['INVALID_AMT']);
                    }
                  }
                  else{
                    callback(constant['INVALID_EMP_ID']);
                  }
                }
                else{
                  callback(constant['INVALID_EMP_ID']);
                }
              }
            })
          },
          function(err){
            if(err){
              callback({Code:400, Status:false, Message:err});
              utils.writeErrorLog('profile', 'jobProfile', 'Error in desired job type', err);
            }else{
              _updateUserProfile(req.headers.token , 4, "job_seeker_info", "job_profile", req, res, callback);
            }
          }
        );
      }
    }
    else{
      callback({Code:400, Status:false, Message:constant['INVALID_FORMAT']});
    }
  }else{
    callback({Code:400, Status:false, Message:constant['AUTH_FAIL']});
  }
}

/**
   * @method posterBasicProfile
   * @used For saving poster basic profile details of user
   * @param object req, object res.
   * @return object res.
   * @author KTI0591
*/
function posterBasicProfile(req, res, callback) {
  utils.writeInsideFunctionLog('profile', 'posterBasicProfile');

  if(!!req.headers.token && !!req.body.first_name && !!req.body.last_name && !!req.body.job_posters_info.basic_profile.basic_info.street_address && !!req.body.job_posters_info.basic_profile.basic_info.city && !!req.body.job_posters_info.basic_profile.basic_info.state_id && !!req.body.job_posters_info.basic_profile.basic_info.zipcode && !!req.body.job_posters_info.basic_profile.basic_info.phone_number){
    if(validator.alphaWithDashOnly(req.body.first_name) && validator.alphaWithDashOnly(req.body.last_name) && validator.maxLength(req.body.job_posters_info.basic_profile.basic_info.zipcode, 5,true) && validator.minLength(req.body.job_posters_info.basic_profile.basic_info.zipcode, 5,true) && validator.maxLength(req.body.job_posters_info.basic_profile.basic_info.phone_number, 12, true) && validator.minLength(req.body.job_posters_info.basic_profile.basic_info.phone_number, 12,true) && validator.maxLength(req.body.job_posters_info.basic_profile.firm_name,100, false) && validator.maxLength(req.body.job_posters_info.basic_profile.title,100, false)){
        if((!!req.body.job_posters_info.basic_profile.website_url && validator.websiteValidation(req.body.job_posters_info.basic_profile.website_url)) || req.body.job_posters_info.basic_profile.website_url == ''){
          _updateUserProfile(req.headers.token , 1, "job_posters_info", "basic_profile", req, res, callback);
        } else {
          callback({Code:400, Status:false, Message:constant['INVALID_URL']});
        }
      } else {
        callback({Code:400, Status:false, Message:constant['INVALID_FORMAT']});
      }
  } else {
    callback({Code:400, Status:false, Message:constant['EMPTY_FIELD_ERROR']});
  }
}

function uploadDeliverable(fileObj, userId, jobId, key, callback) {
  utils.writeInsideFunctionLog('profile', 'uploadDeliverable', {'userId': userId, 'jobId': jobId, 'key': key});

  if (key == 'upload') {
    fileObj['jobId'] = jobId;
    _uploadFile('deliverables', fileObj, userId, function(err, succ) {
      if (err) {
        callback(true, {Code:400, Status:false, Message:err});
      } else {
        let obj = {
          'filename': fileObj.name,
          'filepath': succ
        };
        callback(false, obj);
      }
    })
  } else {
    _deleteFile(fileObj);
    callback(false, fileObj);
  }
}

function downloadFile(filepath, callback) {
  utils.writeInsideFunctionLog('profile', 'downloadFile', {'filepath': filepath});

  var params = {
    Key: filepath
  };
  s3Bucket.getObject(params, function (err, data) {
    if (data) {
      callback(false, data);
    } else {
      callback(true, filepath);
      utils.writeErrorLog('profile', 'downloadFile', 'Error while downloading file from s3 Bucket', err, params);
    }
  });
}

/**
   * @method getCandidatesData
   * get Active and Valid job Candidates Data for Job posters
   * @param {object} req
   * @param {object} res
   * @param {function} callback
*/
function getCandidatesData(req, res, cb) {
  utils.writeInsideFunctionLog('profile', 'getCandidatesData');

  let resObj = Object.assign({}, utils.getErrorResObj());
  if(!!req.headers.token) {
    helper.checkUserLoggedIn(req.headers.token , function(loginErr, result){
      if (loginErr) {
        resObj['message'] = constant['AUTH_FAIL'];
        resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
        utils.callCB(cb, resObj);
      } else {
        if (result.job_posters_info.is_profile_completed !== 'Y') {

          resObj['message'] = constant['AUTH_FAIL'];
          resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];

          utils.callCB(cb, resObj);

        } else {
          const query = {
            status: 1,
            is_bar_id_valid: 'Yes',
            'job_seeker_info.is_profile_completed': 'Y'
          }

          users.find(query, function(err, users) {
            if (err) {
              resObj['message'] = constant['NO_RESOURCE_FOUND'];
              resObj['code'] = constant['RES_OBJ']['CODE']['FAIL'];

              utils.callCB(cb, resObj);
            } else {
              resObj = Object.assign({}, utils.getSuccessResObj());
              resObj['data'] = users;

              utils.callCB(cb, resObj)
            }
          })
        }
      }
    })
  }
}

module.exports = {
  getUserProfile,
  basicProfile,
  experienceProfile,
  networkProfile,
  jobProfile,
  posterBasicProfile,
  uploadDeliverable,
  downloadFile,
  deleteFiles,
  getCandidatesData,
}
