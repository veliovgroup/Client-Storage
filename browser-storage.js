var BaseStorage = require('./base-storage.js');
var localStorageDriver;

/**
 * @locus Client
 * @class BrowserStorage
 * @summary localStorage driven storage. Extends BaseStorage for shared cache/TTL/get/has logic.
 */
function BrowserStorage(clientStorage) {
  BaseStorage.call(this, clientStorage);
  this.init();
}

BrowserStorage.prototype = Object.create(BaseStorage.prototype);
BrowserStorage.prototype.constructor = BrowserStorage;

/**
 * @locus Client
 * @memberOf BrowserStorage
 * @name init
 * @summary Load from localStorage, cleanup expired TTL items, populate data/ttlData. Fixes TTL key mapping bug.
 * @returns {void 0}
 */
BrowserStorage.prototype.init = function () {
  localStorageDriver = window.localStorage || localStorage;
  var TTL_SUFFIX = '.___exp';

  // CLEAN UP EXPIRED ITEMS + populate data/ttlData (uses BaseStorage cache)
  var i = localStorageDriver.length;
  while (i--) {
    var key = localStorageDriver.key(i);
    if (typeof key !== 'string') continue;

    if (key.indexOf(TTL_SUFFIX) !== -1) {
      var expireAt = parseInt(localStorageDriver.getItem(key), 10);
      var mainKey = key.replace(TTL_SUFFIX, '');
      if (expireAt <= Date.now() || isNaN(expireAt)) {
        localStorageDriver.removeItem(key);
        localStorageDriver.removeItem(mainKey);
      } else {
        this.ttlData[mainKey] = expireAt;
      }
    } else {
      var item = localStorageDriver.getItem(key);
      if (item !== null) {
        this.data[key] = this.unescape(item);
      }
    }
  }
};

/**
 * @locus Client
 * @memberOf BrowserStorage
 * @name set
 * @param {String} key - Key to create/overwrite
 * @param {any} value - Value (string, object, array, boolean, null, undefined supported via JSON)
 * @param {Number} [ttl] - TTL in seconds
 * @summary Create/overwrite record in localStorage (with TTL companion key).
 * @returns {Boolean}
 */
BrowserStorage.prototype.set = function (key, value, ttl) {
  if (BaseStorage.prototype.set.call(this, key, value, ttl)) {
    localStorageDriver.setItem(key, this.escape(value));
    if (typeof ttl === 'number' && this.ttlData[key]) {
      localStorageDriver.setItem(key + this.TTL_SUFFIX, this.ttlData[key]);
    }
    return true;
  }
  return false;
};

/**
 * @locus Client
 * @memberOf BrowserStorage
 * @name remove
 * @param {String} key - The name of the record to remove
 * @summary Remove a record(s).
 * @returns {Boolean}
 */
BrowserStorage.prototype.remove = function (key) {
  var result = BaseStorage.prototype.remove.call(this, key);
  if (typeof key === 'string') {
    localStorageDriver.removeItem(key);
    localStorageDriver.removeItem(key + this.TTL_SUFFIX);
  }
  // For empty(), base already looped and called remove on each key (storage cleaned via override)
  return result;
};

/**
 * @locus Client
 * @memberOf BrowserStorage
 * @name isSupported
 * @summary Returns true if localStorage is supported (handles Private mode in Safari).
 * @returns {Boolean}
 */
BrowserStorage.isSupported = function () {
  try {
    if ('localStorage' in window && window.localStorage !== null) {
      // Safari will throw an exception in Private mode
      window.localStorage.setItem('___test___', 'test');
      window.localStorage.removeItem('___test___');
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

module.exports = BrowserStorage;
