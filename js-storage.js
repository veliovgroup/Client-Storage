import BaseStorage from './base-storage.js';

/**
 * @locus Client
 * @class JSStorage
 * @summary JavaScript Object-driven (in-memory) storage. Extends BaseStorage (no overrides needed).
 */
class JSStorage extends BaseStorage {
  constructor(clientStorage) {
    super(clientStorage);
  }

  /**
   * @locus Client
   * @memberOf JSStorage
   * @name isSupported
   * @summary Always returns true for in-memory driver.
   * @returns {Boolean}
   */
  static isSupported() {
    return true;
  }
}

export default JSStorage;
