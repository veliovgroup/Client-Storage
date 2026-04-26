import helpers from './helpers.js';

const TTL_SUFFIX = '.___exp';

/**
 * Base class for shared storage logic: cache, TTL handling, common methods.
 * Reduces duplication across drivers. Drivers extend and implement storage-specific ops.
 * @locus Client
 */
class BaseStorage {
  constructor(clientStorage) {
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
  _checkTTL(key) {
    const expireAt = this.ttlData[key];
    if (expireAt && expireAt <= Date.now()) {
      this.remove(key);
      return true;
    }
    return false;
  }

  get(key) {
    if (typeof key !== 'string') return void 0;
    if (!this.data.hasOwnProperty(key)) return void 0;
    if (this._checkTTL(key)) return void 0;
    return this.data[key];
  }

  has(key) {
    if (typeof key !== 'string') return false;
    if (!this.data.hasOwnProperty(key)) return false;
    if (this._checkTTL(key)) return false;
    return true;
  }

  keys() {
    return Object.keys(this.data);
  }

  empty() {
    return this.remove();
  }

  set(key, value, ttl) {
    if (typeof key !== 'string') return false;
    this.data[key] = value;
    if (typeof ttl === 'number' && ttl > 0) {
      const expireAt = Date.now() + (ttl * 1000);
      this.ttlData[key] = expireAt;
      return true; // driver must call super or implement full
    }
    return true;
  }

  remove(key) {
    if (typeof key === 'string') {
      if (this.data.hasOwnProperty(key)) {
        delete this.data[key];
        delete this.ttlData[key];
        return true;
      }
      return false;
    }
    // empty all
    const keys = this.keys();
    if (keys.length === 0) return false;
    for (let i = 0; i < keys.length; i++) {
      this.remove(keys[i]);
    }
    return true;
  }

  escape(val) {
    return escape(this.helpers.escape(val));
  }

  unescape(val) {
    return this.helpers.unescape(unescape(val));
  }

  static isSupported() {
    return true;
  }
}

export default BaseStorage;
