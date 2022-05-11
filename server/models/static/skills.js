var rfr = require('rfr');

var skillSchema = rfr('/server/schemas/ddl/static/skills'),
utils = rfr('/server/shared/utils');

var skillModule = (function() {
  var resObj = Object.assign({}, utils.getErrorResObj());
  var findSkills = function(req, res, cb) {
    var dbQueryParams = {
      'projection': { 'name': 1, 'status': 1 },
      'sortOption': { '_id': 1 }
    }
    skillSchema.findQuery(dbQueryParams, function(err, res) {
      if (res) {
        resObj = Object.assign({}, utils.getSuccessResObj());
        resObj['data'] = {
          'skills': res
        }
      }
      utils.callCB(cb, resObj);
    });
  }
  var getSkills = function(req, res, cb) {
    if (!resObj['data']['skills']) {
      var callback = function (resObj) {
        utils.callCB(cb, resObj);
      }
      findSkills(req, res, callback);
    } else {
      utils.callCB(cb, resObj);
    }
  }
  return {
    getSkills: getSkills
  }
})();

function get (req, res, cb) {
  skillModule.getSkills(req, res, cb);
}

module.exports =  { get }
