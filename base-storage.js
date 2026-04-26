'use strict';

var helpers = require('./helpers.js');

var TTL_SUFFIX = '.___exp';

/**
 * Base class for shared storage logic: cache, TTL handling, common methods.
 * Reduces duplication across drivers. Drivers extend and implement storage-specific ops.
 * @locus Client
 */
function BaseStorage(clientStorage) {
  if (clientStorage && clientStorage.data) {
    this.data = clientStorage.data;
    this.ttlData = clientStorage.ttlData;
  } else {
    this.data = {};
    this.ttlData = {};
  }
  this.TTL_SUFFIX = TTL_SUFFIX;
  this.helpers = helpers;
}

/**
 * Check if TTL expired for key. Auto cleanup on access.
 */
BaseStorage.prototype._checkTTL = function (key) {
  var expireAt = this.ttlData[key];
  if (expireAt && expireAt <= Date.now()) {
    this.remove(key);
    return true;
  }
  return false;
};

BaseStorage.prototype.get = function (key) {
  if (typeof key !== 'string') return void 0;
  if (!this.data.hasOwnProperty(key)) return void 0;
  if (this._checkTTL(key)) return void 0;
  return this.data[key];
};

BaseStorage.prototype.has = function (key) {
  if (typeof key !== 'string') return false;
  if (!this.data.hasOwnProperty(key)) return false;
  if (this._checkTTL(key)) return false;
  return true;
};

BaseStorage.prototype.keys = function () {
  return Object.keys(this.data);
};

BaseStorage.prototype.empty = function () {
  return this.remove();
};

BaseStorage.prototype.set = function (key, value, ttl) {
  if (typeof key !== 'string') return false;
  this.data[key] = value;
  if (typeof ttl === 'number' && ttl > 0) {
    var expireAt = Date.now() + (ttl * 1000);
    this.ttlData[key] = expireAt;
    return true; // driver must call super or implement full
  }
  return true;
};

BaseStorage.prototype.remove = function (key) {
  if (typeof key === 'string') {
    if (this.data.hasOwnProperty(key)) {
      delete this.data[key];
      delete this.ttlData[key];
      return true;
    }
    return false;
  }
  // empty all
  var keys = this.keys();
  if (keys.length === 0) return false;
  for (var i = 0; i < keys.length; i++) {
    this.remove(keys[i]);
  }
  return true;
};

BaseStorage.prototype.escape = function (val) {
  return escape(this.helpers.escape(val));
};

BaseStorage.prototype.unescape = function (val) {
  return this.helpers.unescape(unescape(val));
};

BaseStorage.isSupported = function () {
  return true;
};

module.exports = BaseStorage;
