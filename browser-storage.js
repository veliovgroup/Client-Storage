import BaseStorage from './base-storage.js';
import { createStore, hasOwn } from './helpers.js';

let localStorageDriver;

/**
 * @locus Client
 * @class BrowserStorage
 * @summary localStorage driven storage. Extends BaseStorage for shared cache/TTL/get/has logic.
 */
class BrowserStorage extends BaseStorage {
  constructor(clientStorage) {
    super(clientStorage);
    this.init();
  }

  /**
   * @locus Client
   * @memberOf BrowserStorage
   * @name init
   * @summary Load from localStorage, cleanup expired TTL items, populate data/ttlData. Fixes TTL key mapping bug.
   * @returns {void 0}
   */
  init() {
    localStorageDriver = window.localStorage || localStorage;
    const expiredKeys = createStore();
    const storageKeys = [];
    const now = Date.now();

    let i = localStorageDriver.length;
    while (i--) {
      const key = localStorageDriver.key(i);
      if (typeof key !== 'string') continue;
      storageKeys.push(key);
    }

    storageKeys.forEach((key) => {
      if (key.endsWith(this.TTL_SUFFIX)) {
        const expireAt = parseInt(localStorageDriver.getItem(key), 10);
        const mainKey = key.slice(0, -this.TTL_SUFFIX.length);
        if (expireAt <= now || isNaN(expireAt)) {
          expiredKeys[mainKey] = true;
          localStorageDriver.removeItem(key);
          localStorageDriver.removeItem(mainKey);
          delete this.data[mainKey];
          delete this.ttlData[mainKey];
        } else {
          this.ttlData[mainKey] = expireAt;
        }
      }
    });

    storageKeys.forEach((key) => {
      if (!key.endsWith(this.TTL_SUFFIX) && !hasOwn(expiredKeys, key)) {
        const item = localStorageDriver.getItem(key);
        if (item !== null) {
          this.data[key] = this.unescape(item);
        }
      }
    });
  }

  /**
   * @locus Client
   * @memberOf BrowserStorage
   * @name set
   * @param {String} key - Key to create/overwrite
   * @param {any} value - Value (string, object, array, boolean, null, undefined supported via JSON)
   * @param {Number} [ttl] - TTL in seconds
   * @summary Create/overwrite record in localStorage (with TTL companion key).
   * @returns {Boolean}
   */
  set(key, value, ttl) {
    if (super.set(key, value, ttl)) {
      localStorageDriver.setItem(key, this.escape(value));
      if (hasOwn(this.ttlData, key)) {
        localStorageDriver.setItem(key + this.TTL_SUFFIX, this.ttlData[key]);
      } else {
        localStorageDriver.removeItem(key + this.TTL_SUFFIX);
      }
      return true;
    }
    return false;
  }

  /**
   * @locus Client
   * @memberOf BrowserStorage
   * @name remove
   * @param {String} key - The name of the record to remove
   * @summary Remove a record(s).
   * @returns {Boolean}
   */
  remove(key) {
    const result = super.remove(key);
    if (typeof key === 'string') {
      localStorageDriver.removeItem(key);
      localStorageDriver.removeItem(key + this.TTL_SUFFIX);
    }
    // For empty(), base already looped and called remove on each key (storage cleaned via override)
    return result;
  }

  /**
   * @locus Client
   * @memberOf BrowserStorage
   * @name isSupported
   * @summary Returns true if localStorage is supported (handles Private mode in Safari).
   * @returns {Boolean}
   */
  static isSupported() {
    try {
      if (typeof window === 'undefined') {
        return false;
      }
      if ('localStorage' in window && window.localStorage !== null) {
        // Safari will throw an exception in Private mode
        window.localStorage.setItem('___test___', 'test');
        window.localStorage.removeItem('___test___');
        return true;
      }
      return false;
    } catch (_error) {
      return false;
    }
  }
}

export default BrowserStorage;
