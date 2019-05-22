'use strict';

var DEFAULT_TTL = 3.154e+8; // 10 years
var TTL_SUFFIX = '.___exp';
var TTL_SUFFIX_LENGTH  = TTL_SUFFIX.length;

/*
 * @locus Client
 * @class __Cookies
 * @param _cookies {String} - Current cookies as String
 * @summary Internal Class
 */
function __Cookies(_cookies) {
  this.cookies = {};
  if (_cookies && typeof _cookies === 'string') {
    this.init(_cookies);
  }
}

/*
 * @locus Client
 * @memberOf __Cookies
 * @name init
 * @param _cookies {String} - Current cookies as String
 * @summary parse document.cookie string
 * @returns {void 0}
 */
__Cookies.prototype.init = function (_cookies) {
  if (_cookies && _cookies.length) {
    var self = this;
    var i;
    var key;
    var val;

    _cookies.split(/; */).forEach(function (pair) {
      i = pair.indexOf('=');
      if (i < 0) {
        return;
      }

      key = unescape(pair.substr(0, i).trim());
      val = pair.substr(++i, pair.length).trim();

      if (val[0] === '"') {
        val = val.slice(1, -1);
      }

      if (self.cookies[key] === void 0) {
        try {
          self.cookies[key] = unescape(val);
        } catch (e) {
          self.cookies[key] = val;
        }
      }
    });
  }
};

/*
 * @locus Client
 * @memberOf __Cookies
 * @name get
 * @param {String} key  - The name of the cookie to read
 * @summary Read a cookie. If the cookie doesn't exist a void 0 (undefined) value will be returned.
 * @returns {String|void 0}
 */
__Cookies.prototype.get = function (key) {
  if (!key) {
    return void 0;
  }

  if (this.cookies.hasOwnProperty(key)) {
    if (this.cookies.hasOwnProperty(key + TTL_SUFFIX)) {
      var expireAt = this.cookies[key + TTL_SUFFIX];
      console.log({expireAt});
      if (expireAt && expireAt <= Date.now()) {
        this.remove(key);
        return void 0;
      }
    }
    return this.cookies[key];
  }

  return void 0;
};

/*
 * @locus Client
 * @memberOf __Cookies
 * @name set
 * @param {String}  key   - The name of the cookie to create/overwrite
 * @param {String}  value - The value of the cookie
 * @param {Number}  ttl   - Cookies TTL (e.g. max-age) in seconds
 * @summary Create/overwrite a cookie.
 * @returns {Boolean}
 */
__Cookies.prototype.set = function (key, value, ttl) {
  if (!ttl) {
    ttl = DEFAULT_TTL;
  }
  if (key) {
    this.cookies[key] = value;
    document.cookie = escape(key) + '=' + escape(value) + '; Max-Age=' + ttl + '; Path=/';
    if (ttl !== DEFAULT_TTL) {
      var expireAt = +(new Date(Date.now() + (ttl * 1000)));
      this.cookies[key + TTL_SUFFIX] = expireAt;
      document.cookie = escape(key + TTL_SUFFIX) + '=' + expireAt + '; Max-Age=' + ttl + '; Path=/';
    }
    return true;
  }
  return false;
};

/*
 * @locus Client
 * @memberOf __Cookies
 * @name remove
 * @param {String} key  - The name of the cookie to remove
 * @summary Remove a cookie(s).
 * @returns {Boolean}
 */
__Cookies.prototype.remove = function (key) {
  if (key) {
    if (!this.cookies.hasOwnProperty(key)) {
      return false;
    }
    delete this.cookies[key];
    delete this.cookies[key + TTL_SUFFIX];
    document.cookie = escape(key) + '=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/';
    document.cookie = escape(key + TTL_SUFFIX) + '=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/';
    return true;
  } else if (key === void 0) {
    var keys = Object.keys(this.cookies);
    if (keys.length > 0 && keys[0] !== '') {
      for (var i = 0; i < keys.length; i++) {
        this.remove(keys[i]);
      }
      return true;
    }
  }
  return false;
};

/*
 * @locus Client
 * @memberOf __Cookies
 * @name has
 * @param {String} key - The name of the cookie to check
 * @summary Check whether a cookie key is exists
 * @returns {Boolean}
 */
__Cookies.prototype.has = function (key) {
  if (!key) {
    return false;
  }

  return this.cookies.hasOwnProperty(key);
};

/*
 * @locus Client
 * @memberOf __Cookies
 * @name keys
 * @summary Returns an array of Strings with all readable cookies from this location.
 * @returns {[String]}
 */
__Cookies.prototype.keys = function () {
  return Object.keys(this.cookies);
};

/*
 * @locus Client
 * @class ClientStorage
 * @param driver {Sting} - Preferable driver `localStorage` or `cookies`
 * @summary Implement boilerplate Client storage functions, localStorage with fall-back to Cookies
 */
function ClientStorage(driver) {
  this._data = {};
  if (navigator.cookieEnabled) {
    this.cookies = new __Cookies(document.cookie);
  } else {
    this.cookies = false;
  }

  switch (driver) {
  case 'localStorage':
    if (this.LSSupport) {
      this.ls = window.localStorage || localStorage;

      var i = this.ls.length;
      var key;
      while (i--) {
        key = this.ls.key(i);
        if ((key.indexOf(TTL_SUFFIX, key.length - TTL_SUFFIX_LENGTH) !== -1) && this.ls.getItem(key) <= Date.now()) {
          this.ls.removeItem(key);
          this.ls.removeItem(key.replace(TTL_SUFFIX, ''));
        }
      }
    } else {
      console.warn('ClientStorage is set to "localStorage", but it is not supported on this browser');
    }
    break;
  case 'cookies':
    if (this.cookies) {
      this.LSSupport = false;
      this.ls        = null;
    } else {
      console.warn('ClientStorage is set to "cookies", but Cookies is disabled on this browser');
    }
    break;
  case 'js':
    this.cookies   = false;
    this.LSSupport = false;
    this.ls        = null;
    break;
  default:
    if (this.LSSupport) {
      this.ls = window.localStorage || localStorage;
    } else {
      this.ls = null;
    }
    break;
  }
}

/*
 * @function
 * @memberOf ClientStorage
 * @name get
 * @param {String} key - The name of the stored record to read
 * @summary Read a record. If the record doesn't exist a null value will be returned.
 * @returns {mixed}
 */
ClientStorage.prototype.get = function (key) {
  if (!this.has(key)) {
    return void 0;
  }

  var expireAt = 0;

  if (this.LSSupport) {
    expireAt = this.__unescape(this.ls.getItem(key + TTL_SUFFIX));
    if (expireAt && expireAt <= Date.now()) {
      this.ls.removeItem(key);
      this.ls.removeItem(key + TTL_SUFFIX);
      return void 0;
    }
    return this.__unescape(this.ls.getItem(key));
  } else if (this.cookies) {
    return this.__unescape(this.cookies.get(key));
  }

  expireAt = this._data[key + TTL_SUFFIX];
  if (expireAt && expireAt <= Date.now()) {
    delete this._data[key];
    delete this._data[key + TTL_SUFFIX];
    return void 0;
  }
  return this._data[key];
};

/*
 * @function
 * @memberOf ClientStorage
 * @name set
 * @param {String} key   - The name of the key to create/overwrite
 * @param {mixed}  value - The value
 * @param {Number} ttl   - [OPTIONAL] Record TTL in seconds
 * @summary Create/overwrite a value in storage.
 * @returns {Boolean}
 */
ClientStorage.prototype.set = function (key, value, ttl) {
  if (this.LSSupport) {
    this.ls.setItem(key, this.__escape(value));
    if (ttl) {
      this.ls.setItem(key + TTL_SUFFIX, +(new Date(Date.now() + (ttl * 1000))));
    }
  } else if (this.cookies) {
    this.cookies.set(key, this.__escape(value), ttl);
  } else {
    this._data[key] = value;
    if (ttl) {
      this._data[key + TTL_SUFFIX] = +(new Date(Date.now() + (ttl * 1000)));
    }
  }
  return true;
};

/*
 * @function
 * @memberOf ClientStorage
 * @name remove
 * @param {String} key - The name of the record to create/overwrite
 * @summary Remove a record.
 * @returns {Boolean}
 */
ClientStorage.prototype.remove = function (key) {
  if (key && this.has(key)) {
    if (this.LSSupport) {
      this.ls.removeItem(key);
      this.ls.removeItem(key + TTL_SUFFIX);
      return true;
    } else if (this.cookies) {
      return this.cookies.remove(key);
    }
    delete this._data[key];
    delete this._data[key + TTL_SUFFIX];
    return true;
  }
  return false;
};

/*
 * @function
 * @memberOf ClientStorage
 * @name has
 * @param {String} key - The name of the record to check
 * @summary Check if record exists
 * @returns {Boolean}
 */
ClientStorage.prototype.has = function (key) {
  if (this.LSSupport) {
    return !!this.ls.getItem(key);
  } else if (this.cookies) {
    return this.cookies.has(key);
  }
  return this._data.hasOwnProperty(key);
};

/*
 * @function
 * @memberOf ClientStorage
 * @name keys
 * @summary Returns all storage keys
 * @returns {[String]]}
 */
ClientStorage.prototype.keys = function () {
  if (this.LSSupport) {
    var i = this.ls.length;
    var results = [];
    var key;
    while (i--) {
      key = this.ls.key(i);
      if (key.indexOf(TTL_SUFFIX, key.length - TTL_SUFFIX_LENGTH) === -1) {
        results.push(this.ls.key(i));
      }
    }
    return results;
  } else if (this.cookies) {
    return this.cookies.keys();
  }
  return Object.keys(this._data).filter(function (_key) {
    return _key.indexOf(TTL_SUFFIX, _key.length - TTL_SUFFIX_LENGTH) === -1;
  });
};

/*
 * @function
 * @memberOf ClientStorage
 * @name empty
 * @summary Empty storage (remove all key/value pairs)
 * @returns {Boolean}
 */
ClientStorage.prototype.empty = function () {
  if (this.LSSupport && this.ls.length > 0) {
    var self = this;
    this.keys().forEach(function (key) {
      return self.remove(key);
    });
    return true;
  } else if (this.cookies) {
    return this.cookies.remove();
  } else if (Object.keys(this._data).length){
    this._data = {};
    return true;
  }
  return false;
};

/*
 * @function
 * @memberOf ClientStorage
 * @name __escape
 */
ClientStorage.prototype.__escape = function (value) {
  try {
    return JSON.stringify(value);
  } catch (e) {
    try {
      return value.toString();
    } catch (err) {
      return value;
    }
  }
};

/*
 * @function
 * @memberOf ClientStorage
 * @name __unescape
 */
ClientStorage.prototype.__unescape = function (value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

/*
 * @memberOf ClientStorage
 * @name LSSupport
 * @summary Test browser for localStorage support
 */
ClientStorage.prototype.LSSupport = (function () {
  try {
    var support = 'localStorage' in window && window.localStorage !== null;
    if (support) {
      // Safari will throw an exception in Private mode
      window.localStorage.setItem('___test___', 'test');
      window.localStorage.removeItem('___test___');
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
})();

module.exports.clientStorage = ClientStorage;
module.exports.ClientStorage = new ClientStorage();
