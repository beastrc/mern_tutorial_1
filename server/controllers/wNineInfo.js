var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
wNineInfoModel = rfr('/server/models/wNineInfo');

function setAndUpdate(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  wNineInfoModel.setAndUpdate(req, res, cb);
}

module.exports = {
  setAndUpdate
}
