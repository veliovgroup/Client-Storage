import { createStore, hasOwn, parseValue, stringifyValue } from './helpers.js';

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
      this.data = createStore();
      this.ttlData = createStore();
    }
    this.TTL_SUFFIX = TTL_SUFFIX;
  }

  /**
   * Check if TTL expired for key. Auto cleanup on access.
   */
  _checkTTL(key) {
    if (!hasOwn(this.ttlData, key)) return false;

    const expireAt = Number(this.ttlData[key]);
    if (!Number.isFinite(expireAt) || expireAt <= Date.now()) {
      this.remove(key);
      return true;
    }
    return false;
  }

  get(key) {
    if (typeof key !== 'string') return void 0;
    if (!hasOwn(this.data, key)) return void 0;
    if (this._checkTTL(key)) return void 0;
    return this.data[key];
  }

  has(key) {
    if (typeof key !== 'string') return false;
    if (!hasOwn(this.data, key)) return false;
    if (this._checkTTL(key)) return false;
    return true;
  }

  keys() {
    return Object.keys(this.data).filter((key) => !this._checkTTL(key));
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
    } else {
      delete this.ttlData[key];
    }
    return true;
  }

  remove(key) {
    if (key !== void 0 && typeof key !== 'string') return false;
    if (typeof key === 'string') {
      if (hasOwn(this.data, key)) {
        delete this.data[key];
        delete this.ttlData[key];
        return true;
      }
      return false;
    }
    // empty all (key is undefined)
    const keys = this.keys();
    if (keys.length === 0) return false;
    for (let i = 0; i < keys.length; i++) {
      this.remove(keys[i]);
    }
    return true;
  }

  escape(val) {
    return encodeURIComponent(stringifyValue(val));
  }

  unescape(val) {
    let decoded = val;
    try {
      decoded = decodeURIComponent(val);
    } catch (_) {
      // malformed URI sequence — keep raw value
    }
    return parseValue(decoded);
  }

  static isSupported() {
    return true;
  }
}

export default BaseStorage;
