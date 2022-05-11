var rfr = require('rfr');

var jobTypeSchema = rfr('/server/schemas/ddl/static/jobTypes'),
utils = rfr('/server/shared/utils');

var jobTypeModule = (function() {
  var resObj = Object.assign({}, utils.getErrorResObj());
  var findJobTypes = function(req, res, cb) {
    var dbQueryParams = {
      'projection': { 'name': 1, 'status': 1 },
      'sortOption': { '_id': 1 }
    }
    jobTypeSchema.findQuery(dbQueryParams, function(err, res) {
      if (res) {
        resObj = Object.assign({}, utils.getSuccessResObj());
         resObj['data'] = {
          'job_types': res
        }
      }
      utils.callCB(cb, resObj);
    });
  }
  var getJobTypes = function(req, res, cb) {
    if (!resObj['data']['job_types']) {
      var callback = function (resObj) {
        utils.callCB(cb, resObj);
      }
      findJobTypes(req, res, callback);
    } else {
      utils.callCB(cb, resObj);
    }
  }
  return {
    getJobTypes : getJobTypes
  }
})();

function get (req, res, cb) {
  jobTypeModule.getJobTypes(req, res, cb);
}

module.exports =  { get }
