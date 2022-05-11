var rfr = require('rfr');

var workLocationSchema = rfr('/server/schemas/ddl/static/workLocations'),
utils = rfr('/server/shared/utils');

var workLocationModule = (function() {
  var resObj = Object.assign({}, utils.getErrorResObj());
  var findWorkLocations = function(req, res, cb) {
    var dbQueryParams = {
      'projection': { 'name': 1, 'status': 1 },
      'sortOption': { '_id': 1 }
    }
    workLocationSchema.findQuery(dbQueryParams, function(err, res) {
      if (res) {
        resObj = Object.assign({}, utils.getSuccessResObj());
        resObj['data'] = {
          'work_locations': res
        }
      }
      utils.callCB(cb, resObj);
    });
  }

  var getWorkLocations = function(req, res, cb) {
    if (!resObj['data']['work_locations']) {
      var callback = function (resObj) {
        utils.callCB(cb, resObj);
      }
      findWorkLocations(req, res, callback);
    } else {
      utils.callCB(cb, resObj);
    }
  }

  return {
    getWorkLocations: getWorkLocations
  }
})();

function get (req, res, cb) {
  workLocationModule.getWorkLocations(req, res, cb);
}

module.exports =  { get }
