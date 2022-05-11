var rfr = require('rfr'),
moment = require('moment');

var constant = rfr('/server/shared/constant'),
config = rfr('/server/shared/config'),
logger = rfr('/server/shared/logger');

const getCurrentDate = () => Date.now;

const getSuccessResObj = () => {
  var resObj = constant['RES_OBJ'];
  return {
    code: resObj['CODE']['SUCCESS'],
    status: resObj['STATUS']['SUCCESS'],
    message: resObj['MSG']['SUCCESS']
  }
}

const getErrorResObj = () => {
  var resObj = constant['RES_OBJ'];
  return {
    code: resObj['CODE']['FAIL'],
    status: resObj['STATUS']['FAIL'],
    message: resObj['MSG']['FAIL'],
    data: {}
  }
}

const callCB = (callback, resObj) => { (typeof(callback) === 'function') && callback(resObj); }

const sendResponse = (res, resObj) => { res.send(resObj); }

const log = (msg, value = null) => {
  if (config['showServerLog']) {
    console.log(msg, (value === null ? '' : value));
  }
}

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

const getStripeErrorMsg = (errObj = null, key = 'message') => {
  let msg = constant['RES_OBJ']['MSG']['FAILED_DEPENDENCY'];
  if (errObj && errObj[key]) {
    msg = `${errObj[key]} | ${msg}`;
  }
  return msg;
}

const isObjectNotEmpty = (obj) => {
  return (obj !== null && typeof(obj) === 'object' && Object.keys(obj).length);
}

const convertUtcToEst = (date) => {
  return (date ? moment.utc(date).utcOffset(-5) : date);
}

const getCurrentEstDate = () => {
  return convertUtcToEst(new Date().toUTCString()).format(constant['DATE_FORMAT']);
}

const getStringifyObj = (obj = {}) => {
  try {
    return JSON.stringify(obj);
  } catch(ex) {
    writeErrorLog('utils', 'getStringifyObj', 'Exception while doing Stringify', ex);
    return obj;
  }
}

const getParamsObjForLoggerHasPassword = (paramsObj) => {
  let loggerObj = {}
  for (let key in paramsObj) {
    loggerObj[key] = paramsObj[key];
    if (key === 'password' || key === 'confirm_password' || key === 'old_password') {
      loggerObj[key] = constant['PASSWORD_SYMBOL'];
    }
  }
  return loggerObj;
}

const writeInsideFunctionLog = (fileName, funName, params) => {
  if (params) {
    let strParams = getStringifyObj(params);
    logger.info(`[${fileName}] - Inside <${funName}> function with params ${strParams}`);
  } else {
    logger.info(`[${fileName}] - Inside <${funName}> function`);
  }
}

const writeErrorLog = (fileName, funName, msg, err, queryParam) => {
  let stringifyErr = getStringifyObj(err);
  if (queryParam) {
    logger.error(`[${fileName}] | <${funName}> - ${msg} with query ${getStringifyObj(queryParam)} --> ${stringifyErr}`);
  } else {
    logger.error(`[${fileName}] | <${funName}> - ${msg} --> ${stringifyErr}`);
  }
}

module.exports = {
  getCurrentDate,
  getSuccessResObj,
  getErrorResObj,
  callCB,
  sendResponse,
  log,
  toTitleCase,
  getStripeErrorMsg,
  isObjectNotEmpty,
  convertUtcToEst,
  getCurrentEstDate,
  getStringifyObj,
  getParamsObjForLoggerHasPassword,
  writeInsideFunctionLog,
  writeErrorLog
}
