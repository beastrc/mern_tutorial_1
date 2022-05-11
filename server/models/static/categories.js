var rfr = require('rfr');

var categorySchema = rfr('/server/schemas/ddl/static/categories.js'),
utils = rfr('/server/shared/utils');

var categoryModule = (function() {
  var resObj = Object.assign({}, utils.getErrorResObj());
  var findCategories = function(req, res, cb) {
    var dbQueryParams = {
      'projection': { 'name': 1, 'status': 1 },
      'sortOption': { '_id': 1 }
    }
    categorySchema.findQuery(dbQueryParams, function(err, res) {
      if (res) {
        resObj = Object.assign({}, utils.getSuccessResObj());
        resObj['data'] = {
          'categories': res
        }
      }
      utils.callCB(cb, resObj);
    });
  }
  var getCategories = function(req, res, cb) {
    if (!resObj['data']['categories']) {
      var callback = function (resObj) {
        utils.callCB(cb, resObj);
      }
      findCategories(req, res, callback);
    } else {
      utils.callCB(cb, resObj);
    }
  }
  return {
    getCategories: getCategories
  }
})();

function get (req, res, cb) {
  categoryModule.getCategories(req, res, cb);
}

module.exports =  { get }
