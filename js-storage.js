var BaseStorage = require('./base-storage.js');

/**
 * @locus Client
 * @class JSStorage
 * @summary JavaScript Object-driven (in-memory) storage. Extends BaseStorage (no overrides needed).
 */
function JSStorage(clientStorage) {
  BaseStorage.call(this, clientStorage);
}

JSStorage.prototype = Object.create(BaseStorage.prototype);
JSStorage.prototype.constructor = JSStorage;

/**
 * @locus Client
 * @memberOf JSStorage
 * @name isSupported
 * @summary Always returns true for in-memory driver.
 * @returns {Boolean}
 */
JSStorage.isSupported = function () {
  return true;
};

module.exports = JSStorage;
