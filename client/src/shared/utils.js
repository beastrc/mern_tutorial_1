var ES6Promise = require('es6-promise');
ES6Promise.polyfill();

import axios from 'axios';
import moment from 'moment';
import { browserHistory } from 'react-router';
import config from './config';
import constant from './constant';
import cookieManager from './cookieManager';
import sessionManager from './sessionManager';
import legablyStorage from './legablyStorage';

const loader = action => {
  let legablyLoader = $('#legably_loader');
  action === 'start'
    ? legablyLoader.removeClass('hide')
    : legablyLoader.addClass('hide');
};

const flashMsg = (action, msg, type = 'error') => {
  let legablyFlashMsg = $('#legably_flash_msg');
  if (action === 'show') {
    legablyFlashMsg
      .removeClass('hide')
      .children('#msg')
      .text(msg);
    type === 'success' && legablyFlashMsg.addClass('alert-success');
    setTimeout(() => {
      legablyFlashMsg.addClass('hide').removeClass('alert-success');
    }, 3000);
  } else {
    legablyFlashMsg.addClass('hide').removeClass('alert-success');
  }
};

const apiCall = (key, options = {}, callback) => {
  var apiUrls = constant['API_URLS'];
  var urlFrag = apiUrls[key]['name'];
  var isCacheEnabled = apiUrls[key]['cacheEnabled'] === true;
  if (isCacheEnabled) {
    let dataArr = legablyStorage.get(urlFrag);
    if (dataArr.length) {
      return callback(null, dataArr[0]);
    }
  }

  options['showLoader'] !== false && loader('start');

  // This configuration is called in this function because we are getting undefined in build process. In run time this will work properly
  let apiConfig = config.getConfiguration();
  let axiosObj = {
    method: apiUrls[key]['type'],
    baseURL: apiConfig.API_ENDPOINT,
    url: urlFrag,
    data: options['data'] ? trimObj(options['data']) : {}
  };

  let params = options['params'];
  if (params && params.length) {
    axiosObj['url'] = urlFrag + '/' + params.join('/');
  }

  let get_params = options['get_params'];
  if (get_params) {
    var endpoint = "";
    for(var i in get_params) {
      endpoint += i + '=' + get_params[i] + '&';
    }
    endpoint.substring(0, endpoint.length-1);
    axiosObj['url'] = urlFrag + '?' + endpoint;
  }
  console.log(axiosObj['url']);
  if (apiUrls[key]['tokenEnabled'] !== false) {
    axiosObj['headers'] = {
      token: getToken()
    };
  }

  axios(axiosObj)
    .then(response => {
      // success
      if (
        response.data.Message === constant.AUTH_FAIL ||
        response.data.message === constant.AUTH_FAIL
      ) {
        sessionManager.forceLogout();
      } else {
        callback(null, response);
        if (isCacheEnabled) {
          legablyStorage.set(urlFrag, response);
        }
      }
    })
    .catch(err => {
      // error
      callback(err);
    })
    .then(() => {
      // always executed
      // setTimeout(() => {
      options['showLoader'] !== false && loader('stop');
      // }, 700);
    });
};

const setLegablyStorage = (field, value) => {
  legablyStorage.set(field, value);
}

const getLegablyStorage = (field) => {
  return legablyStorage.get(field);
}

const modalPopup = (id, action, self) => {
  $('#' + id).modal(action);

  if (action === 'hide' && self) {
    self.setState({
      modalPopupObj: {}
    });
  }
};

const getCurrentUser = (checkSession = true) => {
  if (checkSession) {
    return sessionManager.isSession() && cookieManager.getObject('currentUser');
  }
  return cookieManager.getObject('currentUser') || {};
};

const getUserRole = () => {
  return getCurrentUser()['role'];
};

const getToken = () => {
  return getCurrentUser()['token'];
};

const isSeekerProfileCompleted = () => {
  return getCurrentUser(false)['is_seeker_profile_completed'];
};

const isPosterProfileCompleted = () => {
  return getCurrentUser(false)['is_poster_profile_completed'];
};

const logout = () => {
  sessionManager.destroy();
};

const getDate = () => {
  let date = new Date();
  let dd = ('0' + date.getDate()).slice(-2);
  let mm = ('0' + (date.getMonth() + 1)).slice(-2);
  return dd + mm + date.getFullYear();
};

const getTime = () => {
  let date = new Date();
  let hh = ('0' + date.getHours()).slice(-2);
  let mm = ('0' + date.getMinutes()).slice(-2);
  let ss = ('0' + date.getSeconds()).slice(-2);
  return hh + mm + ss;
};

const isResSuccess = res =>
  res['data']['code'] === constant['HTTP_STATUS_CODES']['SUCCESS'] &&
  res['data']['status'] === true;

const isResConflict = res =>
  res['data']['code'] === constant['HTTP_STATUS_CODES']['CONFLICT'];

const isResPreconditionReq = res =>
  res['data']['code'] ===
  constant['HTTP_STATUS_CODES']['PRECONDITION_REQUIRED'];

const isResLocked = res =>
  res['data']['code'] === constant['HTTP_STATUS_CODES']['LOCKED'];

const isResBarIdValid = res =>
  res['data']['code'] === constant['HTTP_STATUS_CODES']['INVALID_BAR_ID'];

const getServerErrorMsg = res => {
  let msg = constant['OOPS_ERROR'];
  res['data']['message'] && (msg = res['data']['message'].split(' | ')[0]);
  return msg;
};

const getDataFromRes = (res, key = null) => {
  var data = res['data']['data'];
  if (key) {
    data = data[key];
  }
  return data;
};

const logger = (type, msg, value = null) => {
  let configObj = config.getConfiguration();
  switch (type) {
    case 'error':
      configObj['SHOW_CLIENT_ERROR'] &&
        console.error(msg, value === null ? '' : value);
      break;
    case 'warn':
      configObj['SHOW_CLIENT_WARN'] &&
        console.warn(msg, value === null ? '' : value);
      break;
    case 'log':
      configObj['SHOW_CLIENT_LOG'] &&
        console.log(msg, value === null ? '' : value);
      break;
  }
};

const trimObj = obj => {
  if (!Array.isArray(obj) && typeof obj != 'object') {
    return obj;
  }
  return Object.keys(obj).reduce(
    function (acc, key) {
      if (obj[key]) {
        acc[key.trim()] =
          typeof obj[key] === 'string' ? obj[key].trim() : trimObj(obj[key]);
      } else {
        acc[key.trim()] = obj[key];
      }
      return acc;
    },
    Array.isArray(obj) ? [] : {}
  );
};

const setAllListsData = showLoader => {
  if (
    legablyStorage.get(constant['API_URLS']['GET_ALL_LISTS']['name']).length ===
    0
  ) {
    apiCall('GET_ALL_LISTS', { showLoader: showLoader }, function (
      err,
      response
    ) {
      if (err) {
        logger('error', 'Get All List Error -->', err);
      } else if (!isResSuccess(response)) {
        logger('error', 'Get All List -->', getServerErrorMsg(response));
      }
    });
  }
};

const getListDataRelatedToIds = (key, idsArr = []) => {
  let dataArr = legablyStorage.get(
    constant['API_URLS']['GET_ALL_LISTS']['name']
  );
  if (dataArr.length && isResSuccess(dataArr[0])) {
    return getDataFromRes(dataArr[0], key).filter(function (item) {
      return idsArr.includes(item._id);
    });
  }
  return [];
};

const getListData = key => {
  let listsObj = legablyStorage.get(
    constant['API_URLS']['GET_ALL_LISTS']['name']
  );

  if (listsObj.length && isResSuccess(listsObj[0])) {
    return getDataFromRes(listsObj[0], key);
  }

  return [];
};

const isFunction = cb => typeof cb === 'function';

const isObjectNotEmpty = obj => !!obj && Object.keys(obj).length;

const changeUrl = url => {
  window.scrollTo(0, 0);
  browserHistory.push(url);
};

const goToHome = () => {
  changeUrl(constant['ROUTES_PATH']['HOME']);
};

const insertParam = arr => {
  var location = document.location.search;
  var loc = '';
  for (var j = 0; j < arr.length; j++) {
    var key = arr[j].key;
    var value = arr[j].value;
    key = escape(key);
    value = escape(value);
    var kvp = location.substr(1).split('&');
    if (kvp == '') {
      loc = '?' + key + '=' + value;
    } else {
      var i = kvp.length;
      var x;
      while (i--) {
        x = kvp[i].split('=');
        if (x[0] == key) {
          x[1] = value;
          kvp[i] = x.join('=');
          break;
        }
      }
      if (i < 0) {
        kvp[kvp.length] = [key, value].join('=');
      }
      loc = '?' + kvp.join('&');
    }
    location = loc;
  }
  return location;
};

const removeParam = (key, url) => {
  var rtn = '',
    param,
    params_arr = [],
    queryString = url;
  if (queryString) {
    params_arr = queryString.split('&');
    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split('=')[0];
      if (param === key) {
        params_arr.splice(i, 1);
      }
    }
    rtn = params_arr.join('&');
  }
  return rtn;
};

// ENUMs
var DURATION_PERIOD = {
  DAYS: 'days',
  WEEKS: 'weeks',
  MONTHS: 'months'
};

var RATE_TYPE = {
  HOURLY: 'HOURLY',
  FIXED: 'FIXED'
};

var HOURS_TYPE = {
  PARTTIME: 'partTime',
  FULLTIME: 'fullTime'
};

var job_seeker_info = {
  '0': constant['ROUTES_PATH']['SEEKER_BASIC_INFO'],
  '1': constant['ROUTES_PATH']['SEEKER_EXEPERIENCE'],
  '2': constant['ROUTES_PATH']['SEEKER_HEADLINE'],
  '3': constant['ROUTES_PATH']['SEEKER_JOB_TYPE'],
  '4': constant['ROUTES_PATH']['SEEKER_GET_STARTED']
};

var job_posters_info = {
  '0': constant['ROUTES_PATH']['POSTER_BASIC_INFO'],
  '1': constant['ROUTES_PATH']['POSTER_THANK_YOU']
};

const goToPage = (result, isMovementForSeeker) => {
  let routesPath = constant['ROUTES_PATH'];
  let path = null;
  if (isMovementForSeeker === true) {
    path = routesPath['SEEKER_GET_STARTED'];
    if (result['job_seeker_info']['is_profile_completed'] === 'N') {
      path = job_seeker_info[result.job_seeker_info.last_visited_page];
    }
  } else if (isMovementForSeeker === false) {
    path = routesPath['POSTER_THANK_YOU'];
    if (result['job_posters_info']['is_profile_completed'] === 'N') {
      path = job_posters_info[result.job_posters_info.last_visited_page];
    }
  } else {
    path = job_posters_info[result.job_posters_info.last_visited_page];
    if (result['last_visited_profile'] === 'job_seeker_info') {
      path = job_seeker_info[result.job_seeker_info.last_visited_page];
    }
  }
  path && changeUrl(path);
};

const redirectionHandle = () => {
  if (getUserRole() === 'admin') {
    changeUrl('/admin-dashboard');
  } else {
    let page = cookieManager.get('redirectionPage');
    page && cookieManager.clear('redirectionPage');
    if (isSeekerProfileCompleted() || isPosterProfileCompleted()) {
      goToHome();
    } else {
      if (page) {
        page = page === constant['ROUTES_PATH']['JOB_SEARCH'];
      }
      moveToLastUpdatedEditProfilePage(page);
    }
  }
};

const moveToLastUpdatedEditProfilePage = isMovementForSeeker => {
  if (getUserRole() === 'admin') {
    changeUrl('/admin-dashboard');
  } else {
    apiCall(
      'GET_USER_PROFILE',
      { params: ['job_seeker_info', 'job_posters_info'] },
      function (err, response) {
        if (err) {
          flashMsg('show', 'Error while getting User Profile');
          logger('error', 'Get User Profile Error -->', err);
        } else {
          if (response.data.Code == 200 && response.data.Status == true) {
            let result = response.data.Data;
            goToPage(result, isMovementForSeeker);
          } else {
            flashMsg('show', response.data.Message);
          }
        }
      }
    );
  }
};

const refreshPage = () => {
  window.location.reload();
};

const getParameterByName = name => {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

const convertUtcToEst = date => {
  return date ? moment.utc(date).utcOffset(-5) : date;
};

const getCurrentEstDate = () => {
  return convertUtcToEst(new Date().toUTCString()).format(
    constant['DATE_FORMAT']
  );
};

const getUpdatedCalenderProps = (props, currentDate) => {
  let obj = Object.assign({}, props);
  obj['className'] = obj['className'].replace(/rdtToday/g, '');
  if (currentDate.format(constant['DATE_FORMAT']) == getCurrentEstDate()) {
    obj['className'] = obj['className'] + ' rdtToday';
  }
  return obj;
};

const onImgError = (evt, img) => {
  evt.target.onerror = null;
  evt.target.src = img;
  return true;
};

const onCalendarBlur = evt => {
  $('.date-time > input').blur();
};

const getFormattedAmount = amount => {
  let parts = Number(amount)
    .toFixed(2)
    .split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

module.exports = {
  loader,
  flashMsg,
  apiCall,
  setLegablyStorage,
  getLegablyStorage,
  modalPopup,
  getCurrentUser,
  getUserRole,
  getToken,
  isSeekerProfileCompleted,
  isPosterProfileCompleted,
  logout,
  getDate,
  getTime,
  isResSuccess,
  isResConflict,
  isResPreconditionReq,
  isResLocked,
  isResBarIdValid,
  getServerErrorMsg,
  getDataFromRes,
  logger,
  trimObj,
  setAllListsData,
  getListDataRelatedToIds,
  getListData,
  isFunction,
  isObjectNotEmpty,
  changeUrl: changeUrl,
  goToHome: goToHome,
  insertParam: insertParam,
  removeParam: removeParam,
  ENUM: {
    DURATION_PERIOD: DURATION_PERIOD,
    RATE_TYPE: RATE_TYPE,
    HOURS_TYPE: HOURS_TYPE
  },
  redirectionHandle: redirectionHandle,
  refreshPage: refreshPage,
  moveToLastUpdatedEditProfilePage: moveToLastUpdatedEditProfilePage,
  getParameterByName: getParameterByName,
  convertUtcToEst: convertUtcToEst,
  getCurrentEstDate: getCurrentEstDate,
  getUpdatedCalenderProps: getUpdatedCalenderProps,
  onImgError: onImgError,
  onCalendarBlur: onCalendarBlur,
  getFormattedAmount: getFormattedAmount
};
