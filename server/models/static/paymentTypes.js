var rfr = require('rfr');

var paymentTypeSchema = rfr('/server/schemas/ddl/static/paymentTypes'),
utils = rfr('/server/shared/utils');

var paymentTypeModule = (function() {
  var resObj = Object.assign({}, utils.getErrorResObj());
  var findPaymentTypes = function(req, res, cb) {
    var dbQueryParams = {
      'projection': { 'name': 1, 'status': 1 },
      'sortOption': { '_id': 1 }
    }
    paymentTypeSchema.findQuery(dbQueryParams, function(err, res) {
      if (res) {
        resObj = Object.assign({}, utils.getSuccessResObj());
         resObj['data'] = {
          'payment_types': res
        }
      }
      utils.callCB(cb, resObj);
    });
  }
  var getPaymentTypes = function(req, res, cb) {
    if (!resObj['data']['payment_types']) {
      var callback = function (resObj) {
        utils.callCB(cb, resObj);
      }
      findPaymentTypes(req, res, callback);
    } else {
      utils.callCB(cb, resObj);
    }
  }
  return {
    getPaymentTypes : getPaymentTypes
  }
})();

function get (req, res, cb) {
  paymentTypeModule.getPaymentTypes(req, res, cb);
}

module.exports =  { get }
