var rfr = require('rfr');

var serviceChargeSchema = rfr('/server/schemas/ddl/static/serviceCharges'),
utils = rfr('/server/shared/utils');

var serviceChargeModule = (function() {
  var resObj = Object.assign({}, utils.getErrorResObj());
  var findServiceCharge = function(req, res, cb) {
    var dbQueryParams = {
      'projection': { 'service_charge': 1 }
    }
    serviceChargeSchema.findQuery(dbQueryParams, function(err, res) {
      if (res) {
        resObj = Object.assign({}, utils.getSuccessResObj());
        resObj['data'] = {
          'service_charge': res.length ? res[0]['service_charge'] : 0
        }
      }
      utils.callCB(cb, resObj);
    });
  }
  var getServiceCharge = function(req, res, cb) {
    if (!resObj['data'].hasOwnProperty['service_charge']) {
      var callback = function (resObj) {
        utils.callCB(cb, resObj);
      }
      findServiceCharge(req, res, callback);
    } else {
      utils.callCB(cb, resObj);
    }
  }
  return {
    getServiceCharge: getServiceCharge
  }
})();

function get (req, res, cb) {
  serviceChargeModule.getServiceCharge(req, res, cb);
}

module.exports =  { get }
