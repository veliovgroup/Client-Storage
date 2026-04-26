import ClientStorage, {
  BaseStorage,
  BrowserStorage,
  ClientStorage as NamedClientStorage,
  CookiesStorage,
  JSStorage
} from 'ClientStorage';

const storage = new ClientStorage('js');
storage.set('token', 'abc', 30);
storage.set('prefs', { darkMode: true });

const hasToken: boolean = storage.has('token');
const keys: string[] = storage.keys();
const maybeValue: unknown = storage.get('prefs');

const namedStorage = new NamedClientStorage('cookies');
namedStorage.empty();

const baseDriver = new BaseStorage(storage);
const jsDriver = new JSStorage(storage);
const browserDriver = new BrowserStorage(storage);
const cookiesDriver = new CookiesStorage(storage, '');

const driverSupportFlags: boolean[] = [
  JSStorage.isSupported(),
  BrowserStorage.isSupported(),
  CookiesStorage.isSupported()
];

void hasToken;
void keys;
void maybeValue;
void namedStorage;
void baseDriver;
void jsDriver;
void browserDriver;
void cookiesDriver;
void driverSupportFlags;

// @ts-expect-error invalid driver name must fail
new ClientStorage('sessionStorage');

// @ts-expect-error invalid key type must fail
storage.set(123, 'value');

// @ts-expect-error ttl must be number
storage.set('ttl', 'value', '100');
