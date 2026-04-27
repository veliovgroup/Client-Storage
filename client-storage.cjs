'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*
 * @Object
 * @name helpers
 */
const stringifyValue = (value) => {
  if (value === undefined) return 'undefined';
  try {
    return JSON.stringify(value);
  } catch (e) {
    try {
      return value.toString();
    } catch (err) {
      return String(value);
    }
  }
};

const parseValue = (value) => {
  if (value === 'undefined' || value === undefined) return undefined;
  if (value === 'null') return null;
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const createStore = () => Object.create(null);

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
      document.cookie = `${escapedKey}=${escapedValue}; Max-Age=${ttl}; Path=/`;
      document.cookie = `${escapedKey}${this.TTL_SUFFIX}=${expireAt}; Max-Age=${ttl}; Path=/`;
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
      document.cookie = `${escapedKey}=; Expires=${EXPIRATION_COOKIE}; Path=/`;
      document.cookie = `${escapedKey}${this.TTL_SUFFIX}=; Expires=${EXPIRATION_COOKIE}; Path=/`;
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

      const marker = `${IS_SUPPORTED_KEY}=${IS_SUPPORTED_VALUE}`;
      document.cookie = `${marker}; Max-Age=${Math.floor(DEFAULT_TTL)}; Path=/`;
      result = new RegExp(`(?:^|;\\s*)${marker}(?:;|$)`).test(document.cookie);
      document.cookie = `${IS_SUPPORTED_KEY}=; Expires=${EXPIRATION_COOKIE}; Path=/`;
    } catch (_) {
      return false;
    }
    return result && navigator.cookieEnabled;
  }
}

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

const isServer = () =>
  typeof window === 'undefined' || typeof document === 'undefined';

const debug = (...args) => {
  if (typeof console === 'object' && console && console.warn) {
    // eslint-disable-next-line no-console
    console.warn(...args);
  }
};

const mixin = (target, proto) => {
  if (!proto || proto === Object.prototype) return;
  Object.getOwnPropertyNames(proto).forEach((name) => {
    if (name !== 'constructor' && !(name in target)) {
      target[name] = proto[name];
    }
  });
  mixin(target, Object.getPrototypeOf(proto));
};

/**
 * @locus Client
 * @class ClientStorage
 * @param {String} [driverName] - Preferred driver: 'localStorage' | 'cookies' | 'js'
 * @summary Client storage facade with pluggable drivers (localStorage > cookies > js in-memory). Supports TTL, JSON values, Unicode. Server uses JSStorage.
 */
class ClientStorage {
  constructor(driverName) {
    this.data = createStore();
    this.ttlData = createStore();
    let StorageDriver;
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
    this.TTL_SUFFIX = this.driver.TTL_SUFFIX;
    // Mix methods from driver prototype chain (BaseStorage + driver overrides) to preserve API
    mixin(this, StorageDriver.prototype);
  }

  /**
   * @locus Client
   * @memberOf ClientStorage
   * @name set
   * @param {String} key - The key of the value to set
   * @param {*} value - JSON-serializable value to store
   * @param {Number} [ttl] - Optional time-to-live in seconds
   * @summary Store a value under key with optional TTL.
   * @returns {Boolean}
   */
  set(key, value, ttl) {
    return this.driver.set(key, value, ttl);
  }

  /**
   * @locus Client
   * @memberOf ClientStorage
   * @name get
   * @param {String} key - The key of the value to read
   * @summary Read a stored value by key. Returns undefined if not exists or expired (auto-removes expired).
   * @returns {any|undefined}
   */
  get(key) {
    return this.driver.get(key);
  }

  /**
   * @locus Client
   * @memberOf ClientStorage
   * @name has
   * @param {String} key - The name of the record to check
   * @summary Check whether a record key is exists
   * @returns {Boolean}
   */
  has(key) {
    return this.driver.has(key);
  }

  /**
   * @locus Client
   * @memberOf ClientStorage
   * @name keys
   * @summary Returns an array of Strings with all readable keys.
   * @returns {[String]}
   */
  keys() {
    return this.driver.keys();
  }

  /**
   * @locus Client
   * @memberOf ClientStorage
   * @name remove
   * @param {String} [key] - The name of the record to remove. Omit to remove all.
   * @summary Remove a single record by key, or all records if no key provided.
   * @returns {Boolean}
   */
  remove(key) {
    return this.driver.remove(key);
  }

  /**
   * @function
   * @memberOf ClientStorage
   * @name empty
   * @summary Empty storage (remove all key/value pairs)
   * @returns {Boolean}
   */
  empty() {
    return this.driver.remove();
  }
}

exports.BaseStorage = BaseStorage;
exports.BrowserStorage = BrowserStorage;
exports.ClientStorage = ClientStorage;
exports.CookiesStorage = CookiesStorage;
exports.JSStorage = JSStorage;
exports.default = ClientStorage;
