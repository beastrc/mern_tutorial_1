var rfr = require('rfr');

var stateSchema = rfr('/server/schemas/ddl/static/states'),
utils = rfr('/server/shared/utils');

var stateModule = (function() {
  var resObj = Object.assign({}, utils.getErrorResObj());
  var findStates = function(req, res, cb) {
    var dbQueryParams = {
      'projection': { 'name': 1, 'abbr': 1, 'status': 1 },
      'sortOption': { '_id': 1 }
    }
    stateSchema.findQuery(dbQueryParams, function(err, res) {
      if (res) {
        resObj = Object.assign({}, utils.getSuccessResObj());
        resObj['data'] = {
          'states': res
        }
      }
      utils.callCB(cb, resObj);
    });
  }
  var getStates = function(req, res, cb) {
    if (!resObj['data']['states']) {
      var callback = function (resObj) {
        utils.callCB(cb, resObj);
      }
      findStates(req, res, callback);
    } else {
      utils.callCB(cb, resObj);
    }
  }
  return {
    getStates: getStates
  }
})();

function get (req, res, cb) {
  stateModule.getStates(req, res, cb);
}

module.exports =  { get }
