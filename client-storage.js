'use strict';

var CookiesStorage = require('./cookies-storage.js');
var JSStorage = require('./js-storage.js');
var BrowserStorage = require('./browser-storage.js');

var isServer = function () {
  return typeof process === 'object' && !process?.browser;
};

var debug = function () {
  console.warn.apply(console, arguments);
};

/**
 * @locus Client
 * @class ClientStorage
 * @param driverName {Sting} - Preferable driver `localStorage` or `cookies`
 * @summary Implement boilerplate Client storage functions, localStorage with fall-back to CookiesStorage
 */
function ClientStorage(driverName) {
  this.data = {};
  this.ttlData = {};
  var StorageDriver;
  this.driverName = driverName;

  if (isServer()) {
    StorageDriver = JSStorage;
    this.driverName = 'js';
  } else {
    switch (driverName) {
    case 'localStorage':
      if (BrowserStorage.isSupported()) {
        StorageDriver = BrowserStorage;
      } else {
        debug('ClientStorage is set to "localStorage", but it is not supported on this browser');
      }
      break;
    case 'cookies':
      if (CookiesStorage.isSupported()) {
        StorageDriver = CookiesStorage;
      } else {
        debug('ClientStorage is set to "cookies", but CookiesStorage is disabled on this browser');
      }
      break;
    case 'js':
      StorageDriver = JSStorage;
      this.driverName = 'js';
      break;
    default:
      break;
    }
  }

  if (!StorageDriver) {
    if (BrowserStorage.isSupported()) {
      this.driverName = 'localStorage';
      StorageDriver = BrowserStorage;
    } else if (CookiesStorage.isSupported()) {
      this.driverName = 'cookies';
      StorageDriver = CookiesStorage;
    } else {
      this.driverName = 'js';
      StorageDriver = JSStorage;
    }
  }

  if (this.driverName === 'cookies') {
    this.driver = new StorageDriver(this, document.cookie);
  } else {
    this.driver = new StorageDriver(this);
  }
  Object.assign(this, StorageDriver.prototype);
}

/**
 * @locus Client
 * @memberOf ClientStorage
 * @name get
 * @param {String} key - The key of the value to read
 * @summary Read a stored value by key. If the key doesn't exist a void 0 (undefined) value will be returned.
 * @returns {String|Mix|void 0}
 */
ClientStorage.prototype.get = function (key) {
  if (typeof key !== 'string') {
    return void 0;
  }

  if (this.data.hasOwnProperty(key)) {
    if (this.ttlData[key] <= Date.now()) {
      this.remove(key);
      return void 0;
    }
    return this.data[key];
  }

  return void 0;
};

/**
 * @locus Client
 * @memberOf ClientStorage
 * @name has
 * @param {String} key - The name of the record to check
 * @summary Check whether a record key is exists
 * @returns {Boolean}
 */
ClientStorage.prototype.has = function (key) {
  if (typeof key !== 'string') {
    return false;
  }

  if (this.data.hasOwnProperty(key)) {
    if (this.ttlData[key] <= Date.now()) {
      this.remove(key);
      return false;
    }
    return true;
  }
  return false;
};

/**
 * @locus Client
 * @memberOf ClientStorage
 * @name keys
 * @summary Returns an array of Strings with all readable keys.
 * @returns {[String]}
 */
ClientStorage.prototype.keys = function () {
  return Object.keys(this.data);
};

/**
 * @function
 * @memberOf ClientStorage
 * @name empty
 * @summary Empty storage (remove all key/value pairs)
 * @returns {Boolean}
 */
ClientStorage.prototype.empty = function () {
  return this.remove();
};

module.exports.JSStorage = JSStorage;
module.exports.BrowserStorage = BrowserStorage;
module.exports.CookiesStorage = CookiesStorage;

module.exports.ClientStorage = ClientStorage;
