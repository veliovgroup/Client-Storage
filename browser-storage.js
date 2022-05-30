var helpers = require('./helpers.js');
var TTL_SUFFIX = '.___exp';
var localStorageDriver;

/**
 * @locus Client
 * @class BrowserStorage
 * @summary localStorage driven storage
 */
function BrowserStorage(clientStorage) {
  if (clientStorage) {
    this.data = clientStorage.data;
    this.ttlData = clientStorage.ttlData;
  } else {
    this.data = {};
    this.ttlData = {};
  }
  this.init();
}

/**
 * @locus Client
 * @memberOf BrowserStorage
 * @name init
 * @summary parse document.cookie string
 * @returns {void 0}
 */
BrowserStorage.prototype.init = function () {
  localStorageDriver = window.localStorage || localStorage;

  // CLEAN UP EXPIRED ITEMS
  var i = localStorageDriver.length;
  var key;
  while (i--) {
    key = localStorageDriver.key(i);
    if (typeof key === 'string' && !!~key.indexOf(TTL_SUFFIX)) {
      var expireAt = parseInt(localStorageDriver.getItem(key));
      if (expireAt <= Date.now()) {
        localStorageDriver.removeItem(key);
        localStorageDriver.removeItem(key.replace(TTL_SUFFIX, ''));
      } else {
        this.ttlData[key] = expireAt;
      }
    } else {
      this.data[key] = this.unescape(localStorageDriver.getItem(key));
    }
  }
};

/**
 * @locus Client
 * @memberOf BrowserStorage
 * @name set
 * @param {String} key   - The name of the cookie to create/overwrite
 * @param {String} value - The value of the cookie
 * @param {Number} ttl   - BrowserStorage TTL (e.g. max-age) in seconds
 * @summary Create/overwrite a cookie.
 * @returns {Boolean}
 */
BrowserStorage.prototype.set = function (key, value, ttl) {
  if (typeof key === 'string') {
    this.data[key] = value;
    localStorageDriver.setItem(key, this.escape(value));

    if (typeof ttl === 'number') {
      var expireAt = Date.now() + (ttl * 1000);
      this.ttlData[key] = expireAt;
      localStorageDriver.setItem(key + TTL_SUFFIX, expireAt);
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
  if (typeof key === 'string' && this.data.hasOwnProperty(key)) {
    localStorageDriver.removeItem(key);
    localStorageDriver.removeItem(key + TTL_SUFFIX);
    delete this.data[key];
    delete this.ttlData[key];
    return true;
  }

  if (key === void 0) {
    var keys = this.keys();
    if (keys.length > 0 && keys[0] !== '') {
      for (var i = 0; i < keys.length; i++) {
        this.remove(keys[i]);
      }
      return true;
    }
  }

  return false;
};

/**
 * @locus Client
 * @memberOf BrowserStorage
 * @name escape
 * @param {mix} val - The value to escape
 * @summary Escape and stringify the value
 * @returns {String}
 */
BrowserStorage.prototype.escape = function (val) {
  return escape(helpers.escape(val));
};

/**
 * @locus Client
 * @memberOf BrowserStorage
 * @name unescape
 * @param {String} val - The string to unescape
 * @summary Escape and restore original data-type of the value
 * @returns {mix}
 */
BrowserStorage.prototype.unescape = function (val) {
  return helpers.unescape(unescape(val));
};

/**
 * @locus Client
 * @memberOf BrowserStorage
 * @name isSupported
 * @summary Returns `true` is this storage driver is supported
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
