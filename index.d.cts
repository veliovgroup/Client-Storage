/**
 * @module ClientStorage
 * Bulletproof persistent client-side storage with multiple drivers.
 * Supports localStorage, cookies, in-memory fallback, TTL, complex values (JSON), Unicode.
 * Works in browser, Meteor, Node (server uses in-memory), TypeScript.
 */

export type ClientStorageDriverName = 'localStorage' | 'cookies' | 'js';

export interface StorageDriver {
  set(key: string, value: any, ttl?: number): boolean;
  get(key: string): any;
  has(key: string): boolean;
  keys(): string[];
  remove(key?: string): boolean;
  empty(): boolean;
  /** Internal: escape value for storage */
  escape?(val: any): string;
  /** Internal: unescape value from storage */
  unescape?(val: string): any;
}

export class BaseStorage implements StorageDriver {
  constructor(clientStorage?: any);
  static isSupported(): boolean;
  set(key: string, value: any, ttl?: number): boolean;
  get(key: string): any;
  has(key: string): boolean;
  keys(): string[];
  remove(key?: string): boolean;
  empty(): boolean;
  escape(val: any): string;
  unescape(val: string): any;
}

export class JSStorage extends BaseStorage {
  constructor(clientStorage?: any);
  static isSupported(): boolean;
}

export class BrowserStorage extends BaseStorage {
  constructor(clientStorage?: any);
  static isSupported(): boolean;
  init(): void;
}

export class CookiesStorage extends BaseStorage {
  constructor(clientStorage?: any, cookieString?: string);
  static isSupported(): boolean;
  init(cookieString?: string): void;
}

/**
 * Main ClientStorage class. Provides unified API across drivers.
 * @locus Client
 */
export class ClientStorage {
  /** Current active driver name */
  driverName: ClientStorageDriverName;
  /** Reference to selected driver instance */
  driver: JSStorage | BrowserStorage | CookiesStorage;
  /** In-memory cache of data (shared with driver) */
  data: Record<string, any>;
  /** In-memory TTL timestamps (shared with driver) */
  ttlData: Record<string, number>;

  /**
   * @param driverName Preferred storage driver
   */
  constructor(driverName?: ClientStorageDriverName);

  /**
   * Set a value. Supports any JSON-serializable value, TTL in seconds.
   * @returns true on success
   */
  set(key: string, value: any, ttl?: number): boolean;

  /**
   * Get value by key. Auto-removes expired TTL entries. Returns undefined if missing/expired.
   */
  get(key: string): any;

  /**
   * Check if key exists (and not expired).
   */
  has(key: string): boolean;

  /**
   * Remove specific key or all if no key provided (empty() alias).
   * @returns true if something was removed
   */
  remove(key?: string): boolean;

  /**
   * Alias for remove() with no args.
   */
  empty(): boolean;

  /**
   * List all non-expired keys.
   */
  keys(): string[];

}

export default ClientStorage;

// For Meteor package compatibility
declare module 'meteor/ostrio:cstorage' {
  export { BaseStorage, ClientStorage, JSStorage, BrowserStorage, CookiesStorage } from '.';
  export default ClientStorage;
}
