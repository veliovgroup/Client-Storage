var helpers = require('./helpers.js');
var DEFAULT_TTL = 3.154e+8; // 10 years
var TTL_SUFFIX = '.___exp';

/**
 * @locus Client
 * @class CookiesStorage
 * @param cookieString {String} - Current cookies as String
 * @summary Cookie-driven storage
 */
function CookiesStorage(clientStorage, cookieString) {
  if (clientStorage) {
    this.data = clientStorage.data;
    this.ttlData = clientStorage.ttlData;
  } else {
    this.data = {};
    this.ttlData = {};
  }

  if (cookieString && typeof cookieString === 'string') {
    this.init(cookieString);
  }
}

/**
 * @locus Client
 * @memberOf CookiesStorage
 * @name init
 * @param cookieString {String} - Current cookies as String
 * @summary parse document.cookie string
 * @returns {void 0}
 */
CookiesStorage.prototype.init = function (cookieString) {
  if (typeof cookieString === 'string' && cookieString.length) {
    var self = this;
    var i;
    var key;
    var val;

    cookieString.split(/; */).forEach(function (pair) {
      i = pair.indexOf('=');
      if (i < 0) {
        return;
      }

      key = this.unescape(pair.substr(0, i).trim());
      val = pair.substr(++i, pair.length).trim();

      if (val[0] === '"') {
        val = val.slice(1, -1);
      }

      if (self.data[key] === void 0) {
        if (typeof key === 'string' && !!~key.indexOf(TTL_SUFFIX)) {
          self.ttlData[key] = parseInt(val);
        } else {
          try {
            self.data[key] = this.unescape(val);
          } catch (e) {
            self.data[key] = val;
          }
        }
      }
    });
  }
};

/**
 * @locus Client
 * @memberOf CookiesStorage
 * @name set
 * @param {String} key   - The name of the cookie to create/overwrite
 * @param {String} value - The value of the cookie
 * @param {Number} ttl   - CookiesStorage TTL (e.g. max-age) in seconds
 * @summary Create/overwrite a cookie.
 * @returns {Boolean}
 */
CookiesStorage.prototype.set = function (key, value, _ttl) {
  var ttl = _ttl;
  if (!ttl || typeof ttl !== 'number') {
    ttl = DEFAULT_TTL;
  }

  if (typeof key === 'string') {
    document.cookie = this.escape(key) + '=' + this.escape(value) + '; Max-Age=' + ttl + '; Path=/';
    this.data[key] = value;
    this.ttlData[key] = Date.now() + (ttl * 1000);
    document.cookie = this.escape(key) + TTL_SUFFIX + '=' + this.ttlData[key] + '; Max-Age=' + ttl + '; Path=/';
    return true;
  }
  return false;
};

/**
 * @locus Client
 * @memberOf CookiesStorage
 * @name remove
 * @param {String} key - The name of the cookie to remove
 * @summary Remove a cookie(s).
 * @returns {Boolean}
 */
CookiesStorage.prototype.remove = function (key) {
  if (typeof key === 'string' && this.data.hasOwnProperty(key)) {
    delete this.data[key];
    delete this.ttlData[key];
    document.cookie = this.escape(key) + '=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/';
    document.cookie = this.escape(key) + TTL_SUFFIX + '=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/';
    return true;
  }

  if (key === void 0) {
    var keys = Object.keys(this.data);
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
 * @memberOf CookiesStorage
 * @name escape
 * @param {mix} val - The value to escape
 * @summary Escape and stringify the value
 * @returns {String}
 */
CookiesStorage.prototype.escape = function (val) {
  return escape(helpers.escape(val));
};

/**
 * @locus Client
 * @memberOf CookiesStorage
 * @name unescape
 * @param {String} val - The string to unescape
 * @summary Escape and restore original data-type of the value
 * @returns {mix}
 */
CookiesStorage.prototype.unescape = function (val) {
  return helpers.unescape(unescape(val));
};

/**
 * @locus Client
 * @memberOf CookiesStorage
 * @name isSupported
 * @summary Returns `true` is this storage driver is supported
 * @returns {Boolean}
 */
CookiesStorage.isSupported = function () {
  var result;
  try {
    document.cookie = '___isSupported___=value; Max-Age=' + DEFAULT_TTL + '; Path=/';
    result = document.cookie.includes('___isSupported___');
    document.cookie = '___isSupported___=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/';
  } catch (e) {
    return false;
  }
  return result && navigator.cookieEnabled;
};

module.exports = CookiesStorage;
