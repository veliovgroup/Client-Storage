/**
 * @locus Client
 * @class JSStorage
 * @summary JavaScript Object-driven storage
 */
function JSStorage(clientStorage) {
  if (clientStorage) {
    this.data = clientStorage.data;
    this.ttlData = clientStorage.ttlData;
  } else {
    this.data = {};
    this.ttlData = {};
  }
}

/**
 * @locus Client
 * @memberOf JSStorage
 * @name set
 * @param {String} key   - The key to create/overwrite
 * @param {String} value - The value
 * @param {Number} ttl   - TTL (e.g. max-age) in seconds
 * @summary Create/overwrite a record.
 * @returns {Boolean}
 */
JSStorage.prototype.set = function (key, value, ttl) {
  if (typeof key === 'string') {
    this.data[key] = value;
    if (typeof ttl === 'number') {
      this.ttlData[key] = Date.now() + (ttl * 1000);
    }
    return true;
  }
  return false;
};

/**
 * @locus Client
 * @memberOf JSStorage
 * @name remove
 * @param {String} key - The key of the record to remove
 * @summary Remove record(s).
 * @returns {Boolean}
 */
JSStorage.prototype.remove = function (key) {
  if (typeof key === 'string' && this.data.hasOwnProperty(key)) {
    delete this.data[key];
    delete this.ttlData[key];
    return true;
  }

  if (key === void 0 && Object.keys(this.data).length) {
    this.data = {};
    this.ttlData = {};
    return true;
  }
  return false;
};

/**
 * @locus Client
 * @memberOf JSStorage
 * @name isSupported
 * @summary Returns `true` is this storage driver is supported
 * @returns {Boolean}
 */
JSStorage.isSupported = function () {
  return true;
};

module.exports = JSStorage;
