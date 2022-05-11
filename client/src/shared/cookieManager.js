const _getExpireTime = () => {
  const date = new Date();
  return (new Date(date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000))).toGMTString());
}

const _getExpiredTime = () => {
  return "Thu, 01 Jan 1970 00:00:00 GMT";
}

const set = (key, value) => {
  document.cookie = key + "=" + value + ";expires=" + _getExpireTime() + ";path=/";
}

const setObject = (key, obj) => {
  set(key, JSON.stringify(obj));
}

const get = (key) => {
  var name = key + "=";
  var ca = decodeURIComponent(document.cookie).split(';');
  var value = null;
  for (var i = 0, len = ca.length; i < len; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      value = c.substring(name.length, c.length);
      break;
    }
  }
  return value;
}

const getObject = (key) => {
  return JSON.parse(get(key));
}

const clear = (key) => {
  document.cookie = key + "=;expires=" + _getExpiredTime() + ";path=/";
}

const clearAll = () => {
  var cookies = document.cookie.split(";");
  for (var i = 0, len = cookies.length; i < len; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=" + _getExpiredTime() + ";path=/";
  }
}

module.exports = {
  set,
  setObject,
  get,
  getObject,
  clear,
  clearAll
}
