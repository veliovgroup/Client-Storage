var BaseStorage = require('./base-storage.js');
var DEFAULT_TTL = 3.154e+8; // 10 years

/**
 * @locus Client
 * @class CookiesStorage
 * @summary Cookie-driven storage. Extends BaseStorage.
 */
function CookiesStorage(clientStorage, cookieString) {
  BaseStorage.call(this, clientStorage);

  if (cookieString && typeof cookieString === 'string') {
    this.init(cookieString);
  }
}

CookiesStorage.prototype = Object.create(BaseStorage.prototype);
CookiesStorage.prototype.constructor = CookiesStorage;

/**
 * @locus Client
 * @memberOf CookiesStorage
 * @name init
 * @param {String} [cookieString] - document.cookie string to parse on init.
 * @summary Parse cookies into data/ttlData (uses BaseStorage cache, fixes TTL mapping).
 * @returns {void 0}
 */
CookiesStorage.prototype.init = function (cookieString) {
  if (typeof cookieString === 'string' && cookieString.length) {
    var self = this;
    var TTL_SUFFIX = '.___exp';
    cookieString.split(/; */).forEach(function (pair) {
      var i = pair.indexOf('=');
      if (i < 0) return;

      var keyPart = pair.substr(0, i).trim();
      var valPart = pair.substr(i + 1).trim();
      var key = self.unescape(keyPart);
      var val = valPart;

      if (val && val[0] === '"') {
        val = val.slice(1, -1);
      }

      if (self.data[key] === void 0) {
        if (typeof key === 'string' && key.indexOf(TTL_SUFFIX) !== -1) {
          var mainKey = key.replace(new RegExp(TTL_SUFFIX + '$'), '');
          self.ttlData[mainKey] = parseInt(val, 10) || 0;
        } else {
          try {
            self.data[key] = self.unescape(val);
          } catch (_) {
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
 * @param {String} key - Key to create/overwrite
 * @param {any} value - Value (string, object, array, boolean, null, undefined supported via JSON)
 * @param {Number} [ttl] - TTL in seconds (defaults to ~10 years)
 * @summary Create/overwrite record as cookie (with separate TTL cookie).
 * @returns {Boolean}
 */
CookiesStorage.prototype.set = function (key, value, _ttl) {
  var ttl = (typeof _ttl === 'number' && _ttl > 0) ? _ttl : DEFAULT_TTL;

  if (BaseStorage.prototype.set.call(this, key, value, ttl)) {
    var escapedKey = this.escape(key);
    var escapedValue = this.escape(value);
    var expireAt = this.ttlData[key];
    document.cookie = escapedKey + '=' + escapedValue + '; Max-Age=' + ttl + '; Path=/';
    document.cookie = escapedKey + this.TTL_SUFFIX + '=' + expireAt + '; Max-Age=' + ttl + '; Path=/';
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
  var result = BaseStorage.prototype.remove.call(this, key);
  if (typeof key === 'string') {
    var escapedKey = this.escape(key);
    document.cookie = escapedKey + '=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/';
    document.cookie = escapedKey + this.TTL_SUFFIX + '=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/';
  }
  return result;
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
  } catch (_) {
    return false;
  }
  return result && navigator.cookieEnabled;
};

module.exports = CookiesStorage;
