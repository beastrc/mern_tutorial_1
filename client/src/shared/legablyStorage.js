function set(key, data) {
  this.storageObj[key] = [];
  this.storageObj[key].push(data);
}

function get(key) {
  return this.storageObj[key] || [];
}

function clear(key) {
  return this.storageObj[key] = [];
}

function clearAll() {
  return this.storageObj = {};
}

module.exports = {
  storageObj: {},
  set,
  get,
  clear,
  clearAll
}
