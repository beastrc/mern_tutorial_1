var rfr = require('rfr');

var employmentTypeSchema = rfr('/server/schemas/ddl/static/employmentTypes'),
utils = rfr('/server/shared/utils');

var employmentTypeModule = (function() {
  var resObj = Object.assign({}, utils.getErrorResObj());
  var findEmploymentTypes = function(req, res, cb) {
    var dbQueryParams = {
      'projection': { 'name': 1, 'status': 1 },
      'sortOption': { '_id': 1 }
    }
    employmentTypeSchema.findQuery(dbQueryParams, function(err, res) {
      if (res) {
        resObj = Object.assign({}, utils.getSuccessResObj());
        resObj['data'] = {
          'employment_types': res
        }
      }
      utils.callCB(cb, resObj);
    })
  }
  var getEmploymentTypes = function(req, res, cb) {
    if (!resObj['data']['employment_types']) {
      var callback = function (resObj) {
        utils.callCB(cb, resObj);
      }
      findEmploymentTypes(req, res, callback);
    } else {
      utils.callCB(cb, resObj);
    }
  }
  return {
    getEmploymentTypes: getEmploymentTypes
  }
})();

function get (req, res, cb) {
  employmentTypeModule.getEmploymentTypes(req, res, cb);
}

module.exports =  { get }
