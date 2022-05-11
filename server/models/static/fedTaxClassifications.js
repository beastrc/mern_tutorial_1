var rfr = require('rfr');

var fedTaxClassificationsSchema = rfr('/server/schemas/ddl/static/fedTaxClassifications'),
utils = rfr('/server/shared/utils');

var fedTaxClassificationsModule = (function() {
  var resObj = Object.assign({}, utils.getErrorResObj());
  var findFedTaxClassifications = function(req, res, cb) {
    var dbQueryParams = {
      'projection': { 'name': 1, 'status': 1 },
      'sortOption': { '_id': 1 }
    }
    fedTaxClassificationsSchema.findQuery(dbQueryParams, function(err, res) {
      if (res) {
        resObj = Object.assign({}, utils.getSuccessResObj());
        resObj['data'] = {
          'fed_tax_classifications': res
        }
      }
      utils.callCB(cb, resObj);
    })
  }
  var getFedTaxClassifications = function(req, res, cb) {
    if (!resObj['data']['fed_tax_classifications']) {
      var callback = function (resObj) {
        utils.callCB(cb, resObj);
      }
      findFedTaxClassifications(req, res, callback);
    } else {
      utils.callCB(cb, resObj);
    }
  }
  return {
    getFedTaxClassifications: getFedTaxClassifications
  }
})();

function get (req, res, cb) {
  fedTaxClassificationsModule.getFedTaxClassifications(req, res, cb);
}

module.exports =  { get }
