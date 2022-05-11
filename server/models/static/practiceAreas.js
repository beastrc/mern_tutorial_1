var rfr = require('rfr');

var practiceAreaSchema = rfr('/server/schemas/ddl/static/practiceAreas'),
utils = rfr('/server/shared/utils');

var practiceAreaModule = (function() {
  var resObj = Object.assign({}, utils.getErrorResObj());
  var findPracticeAreas = function(req, res, cb) {
    var dbQueryParams = {
      'projection': { 'name': 1, 'status': 1 },
      'sortOption': { '_id': 1 }
    }
    practiceAreaSchema.findQuery(dbQueryParams, function(err, res) {
      if (res) {
        resObj = Object.assign({}, utils.getSuccessResObj());
        resObj['data'] = {
          'practice_areas': res
        }
      }
      utils.callCB(cb, resObj);
    });
  }
  var getPracticeAreas = function(req, res, cb) {
    if (!resObj['data']['practice_areas']) {
      var callback = function (resObj) {
        utils.callCB(cb, resObj);
      }
      findPracticeAreas(req, res, callback);
    } else {
      utils.callCB(cb, resObj);
    }
  }
  return {
    getPracticeAreas: getPracticeAreas
  }
})();

function get (req, res, cb) {
  practiceAreaModule.getPracticeAreas(req, res, cb);
}

module.exports =  { get }
