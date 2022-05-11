import { browserHistory } from 'react-router';

import config from './config';
import constant from './constant';
import cookieManager from './cookieManager';
var isLoggedIn = false;

const _getCurrentUserObj = (userObj) => {
  let currentUser = {
    'id': userObj['id'],
    'first_name': userObj['first_name'],
    'last_name': userObj['last_name'],
    'email': userObj['email'],
    'role': userObj['role'],
    'token': userObj['token'],
    'is_seeker_profile_completed': !!userObj['is_seeker_profile_completed'],
    'is_poster_profile_completed': !!userObj['is_poster_profile_completed']
  }

  if (userObj['image']) {
    currentUser['image'] = config.getConfiguration()['S3_BUCKET_URL'] + userObj['image'];
  }
  return currentUser;
}

const create = (userObj) => {
  cookieManager.setObject('currentUser', _getCurrentUserObj(userObj));
  isLoggedIn = true;
}

const update = (userObj) => {
  cookieManager.setObject('currentUser', _getCurrentUserObj(userObj));
  isLoggedIn = true;
}

const destroy = () => {
  let remMe = cookieManager.get('rememeberMe');
  cookieManager.clearAll();
  isLoggedIn = false;
  browserHistory.push(constant['ROUTES_PATH']['SIGN_IN']);
  window.scrollTo(0, 0);
  remMe && cookieManager.set('rememeberMe', remMe);
}

const isSession = () => {
  let currUser = cookieManager.getObject('currentUser');
  let rtnVal = false;
  if (currUser && currUser['token']) {
    rtnVal = true;
  } else {
    if (isLoggedIn) {
      isLoggedIn = false;
      forceLogout();
    }
  }
  return rtnVal;
}

const forceLogout = () => {
  destroy();
  $('#legably_loader').addClass('hide');
  throw new Error("Force Logout!!!");
}

module.exports = {
  create,
  update,
  destroy,
  isSession,
  forceLogout
}
