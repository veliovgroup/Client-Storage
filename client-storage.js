import BaseStorage from './base-storage.js';
import CookiesStorage from './cookies-storage.js';
import JSStorage from './js-storage.js';
import BrowserStorage from './browser-storage.js';
import { createStore } from './helpers.js';

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
    // Implemented by selected driver prototype (mixed via Object.assign)
    return this.driver.set ? this.driver.set(key, value, ttl) : false; // fallback
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
   * @function
   * @memberOf ClientStorage
   * @name empty
   * @summary Empty storage (remove all key/value pairs)
   * @returns {Boolean}
   */
  empty() {
    return this.remove();
  }
}

export { BaseStorage, JSStorage, BrowserStorage, CookiesStorage, ClientStorage };
export default ClientStorage;
