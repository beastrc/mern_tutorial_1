var rfr = require('rfr');

var degreeSchema = rfr('/server/schemas/ddl/static/degrees'),
utils = rfr('/server/shared/utils');

var degreeModule = (function() {
  var resObj = Object.assign({}, utils.getErrorResObj());
  var findDegrees = function(req, res, cb) {
    var dbQueryParams = {
      'projection': { 'name': 1, 'status': 1 },
      'sortOption': { '_id': 1 }
    }
    degreeSchema.findQuery(dbQueryParams, function(err, res) {
      if (res) {
        resObj = Object.assign({}, utils.getSuccessResObj());
         resObj['data'] = {
          'degrees': res
        }
      }
      utils.callCB(cb, resObj);
    });
  }
  var getDegrees = function(req, res, cb) {
    if (!resObj['data']['degrees']) {
      var callback = function (resObj) {
        utils.callCB(cb, resObj);
      }
      findDegrees(req, res, callback);
    } else {
      utils.callCB(cb, resObj);
    }
  }
  return {
    getDegrees : getDegrees
  }
})();

function get (req, res, cb) {
  degreeModule.getDegrees(req, res, cb);
}

module.exports =  { get }
