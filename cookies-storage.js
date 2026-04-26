import BaseStorage from './base-storage.js';
import { createStore, hasOwn } from './helpers.js';
const DEFAULT_TTL = 3.154e+8; // 10 years
const IS_SUPPORTED_KEY = '__isSupported__';
const IS_SUPPORTED_VALUE = 'value';
const EXPIRATION_COOKIE = 'Thu, 01 Jan 1970 00:00:00 GMT';

/**
 * @locus Client
 * @class CookiesStorage
 * @summary Cookie-driven storage. Extends BaseStorage.
 */
class CookiesStorage extends BaseStorage {
  constructor(clientStorage, cookieString) {
    super(clientStorage);

    if (cookieString && typeof cookieString === 'string') {
      this.init(cookieString);
    }
  }

  /**
   * @locus Client
   * @memberOf CookiesStorage
   * @name init
   * @param {String} [cookieString] - document.cookie string to parse on init.
   * @summary Parse cookies into data/ttlData (uses BaseStorage cache, fixes TTL mapping).
   * @returns {void 0}
   */
  init(cookieString) {
    if (typeof cookieString === 'string' && cookieString.length) {
      const expiredKeys = createStore();
      const pairs = cookieString.split(/; */).map((pair) => {
        const i = pair.indexOf('=');
        if (i < 0) return null;

        const rawKey = pair.substring(0, i).trim();
        if (!rawKey) return null;
        const valPart = pair.substring(i + 1).trim();
        let val = valPart;

        if (val && val[0] === '"') {
          val = val.slice(1, -1);
        }

        return {
          rawKey,
          val
        };
      }).filter(Boolean);

      pairs.forEach(({ rawKey, val }) => {
        if (rawKey.endsWith(this.TTL_SUFFIX)) {
          const mainKey = this.unescape(rawKey.slice(0, -this.TTL_SUFFIX.length));
          const expireAt = parseInt(val, 10) || 0;
          if (expireAt <= Date.now()) {
            expiredKeys[mainKey] = true;
          } else {
            this.ttlData[mainKey] = expireAt;
          }
        }
      });

      pairs.forEach(({ rawKey, val }) => {
        if (!rawKey.endsWith(this.TTL_SUFFIX)) {
          const key = this.unescape(rawKey);
          if (hasOwn(this.data, key) || hasOwn(expiredKeys, key)) {
            return;
          }
          this.data[key] = this.unescape(val);
        }
      });
    }
  }

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
  set(key, value, _ttl) {
    const ttl = (typeof _ttl === 'number' && _ttl > 0) ? _ttl : DEFAULT_TTL;

    if (super.set(key, value, ttl)) {
      const escapedKey = this.escape(key);
      const escapedValue = this.escape(value);
      const expireAt = this.ttlData[key];
      document.cookie = escapedKey + '=' + escapedValue + '; Max-Age=' + ttl + '; Path=/';
      document.cookie = escapedKey + this.TTL_SUFFIX + '=' + expireAt + '; Max-Age=' + ttl + '; Path=/';
      return true;
    }
    return false;
  }

  /**
   * @locus Client
   * @memberOf CookiesStorage
   * @name remove
   * @param {String} key - The name of the cookie to remove
   * @summary Remove a cookie(s).
   * @returns {Boolean}
   */
  remove(key) {
    const result = super.remove(key);
    if (typeof key === 'string') {
      const escapedKey = this.escape(key);
      document.cookie = escapedKey + '=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/';
      document.cookie = escapedKey + this.TTL_SUFFIX + '=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/';
    }
    return result;
  }

  /**
   * @locus Client
   * @memberOf CookiesStorage
   * @name isSupported
   * @summary Returns `true` is this storage driver is supported
   * @returns {Boolean}
   */
  static isSupported() {
    let result;
    try {
      if (typeof document === 'undefined' || typeof navigator === 'undefined') {
        return false;
      }

      const marker = IS_SUPPORTED_KEY + '=' + IS_SUPPORTED_VALUE;
      document.cookie = marker + '; Max-Age=' + Math.floor(DEFAULT_TTL) + '; Path=/';
      result = new RegExp('(?:^|;\\s*)' + marker + '(?:;|$)').test(document.cookie);
      document.cookie = IS_SUPPORTED_KEY + '=; Expires=' + EXPIRATION_COOKIE + '; Path=/';
    } catch (_) {
      return false;
    }
    return result && navigator.cookieEnabled;
  }
}

export default CookiesStorage;
