import clientStoragePackage = require('ClientStorage');

const storage = new clientStoragePackage.ClientStorage('js');
storage.set('token', 'abc', 30);

const maybeValue: unknown = storage.get('token');
const hasToken: boolean = storage.has('token');
const keys: string[] = storage.keys();

const DefaultClientStorage = clientStoragePackage.default;
const defaultStorage = new DefaultClientStorage('js');

const baseDriver = new clientStoragePackage.BaseStorage(storage);
const jsDriver = new clientStoragePackage.JSStorage(storage);
const browserDriver = new clientStoragePackage.BrowserStorage(storage);
const cookiesDriver = new clientStoragePackage.CookiesStorage(storage, '');

void maybeValue;
void hasToken;
void keys;
void defaultStorage;
void baseDriver;
void jsDriver;
void browserDriver;
void cookiesDriver;

// @ts-expect-error invalid driver name must fail
new clientStoragePackage.ClientStorage('sessionStorage');

// @ts-expect-error ttl must be number
storage.set('ttl', 'value', '100');
