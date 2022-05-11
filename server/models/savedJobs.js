var rfr = require('rfr');

var savedJobsSchema = rfr('/server/schemas/ddl/savedJobs'),
constant = rfr('/server/shared/constant'),
utils = rfr('/server/shared/utils');

var helper = rfr('/server/models/shared/helper');

function get (req, res, cb) {
	var resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req.headers.token, function(err, result){
    if(err){
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    }
    var perPage = 10, page = Math.max(0, req.params.page - 1)
    var dbQueryParams = {
      "user_id": result._id,
      "skip": perPage * page,
      "limit": Number(perPage)
    };
    savedJobsSchema.getCount({"user_id": result._id}, function(cErr, cResult){
      if(!cErr){
        if(cResult > 0){
          savedJobsSchema.fetchAll(dbQueryParams, function(err, res){
            if(res){
              resObj = Object.assign({}, utils.getSuccessResObj());
              resObj['data'] = {
                'count': cResult,
                'jobs': res
              }
            }
            utils.callCB(cb, resObj);
          });
        }else{
          resObj['message'] = constant['NO_RECORD_FOUND'];
          utils.callCB(cb, resObj);
        }
      }else{
        utils.callCB(cb, resObj);
      }
    })
  })
}

function updateSavedJob (req, res, cb){
  var resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req.headers.token , function(err, result){
    if(err){
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    }
    var data = {"user_id": result._id, "job_id": req.body.job_id};
    var key = req.body.key;
    savedJobsSchema.updateSavedJob(key, data, function(err, res){
      if(err){
        resObj.message = constant['OOPS_ERROR'];
      }else{
        resObj = Object.assign({}, utils.getSuccessResObj());
        resObj['data'] = {
         'status': res
        }
      }
      utils.callCB(cb, resObj);
    });
  })
}

module.exports =  {
  get,
  updateSavedJob
}
