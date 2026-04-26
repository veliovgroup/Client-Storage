# ClientStorage

Bulletproof persistent browser storage. Drivers: localStorage > cookies > js (in-memory). TTL, JSON values (objects/arrays/booleans/null/undefined), Unicode. No deps. Meteor + NPM + full TS support.

[![support](https://img.shields.io/badge/support-GitHub-white)](https://github.com/sponsors/dr-dimitru)
[![support](https://img.shields.io/badge/support-PayPal-white)](https://paypal.me/veliovgroup)
<a href="https://ostr.io/info/built-by-developers-for-developers?ref=github-clientstorage-repo-top"><img src="https://ostr.io/apple-touch-icon-60x60.png" height="20"></a>
<a href="https://meteor-files.com/?ref=github-clientstorage-repo-top"><img src="https://meteor-files.com/apple-touch-icon-60x60.png" height="20"></a>

## Persistent Browser (Client) Storage

- 👷 __100% Tests coverage__;
- 📦 No external dependencies;
- 💪 Bulletproof persistent Client storage;
- ㊗️ With Unicode support for values and keys;
- 👨‍💻 With `String`, `Array`, `Object`, and `Boolean` support as values;
- ♿ Works with disabled `localStorage` and `cookies`;
- ☄️ [Meteor.js-specific docs](https://github.com/veliovgroup/Client-Storage/blob/master/docs/meteor.md)
- 📦 Available via [NPM](https://www.npmjs.com/package/ClientStorage) and [Atmosphere](https://atmospherejs.com/ostrio/cstorage).

![ClientStorage NPM library logo](https://raw.githubusercontent.com/veliovgroup/Client-Storage/master/cover.jpg)

## Install

```sh
npm install ClientStorage
```

## Usage

```js
// NPM / TS / ESM
import { ClientStorage } from 'ClientStorage';
const storage = new ClientStorage(); // auto or 'localStorage' | 'cookies' | 'js'
```

### API

- `storage.set(key: string, value: any, ttl?: number): boolean` — Store. TTL in seconds.
- `storage.get(key: string): any | undefined` — Read. Auto-removes expired. `undefined` if missing.
- `storage.has(key: string): boolean` — Exists and not expired.
- `storage.remove(key?: string): boolean` — Remove key or all (empty).
- `storage.empty(): boolean` — Alias for remove(). **Caution**: clears tracked keys; may affect other cookies if no prefix.
- `storage.keys(): string[]` — Current keys.
- `storage.driverName` — Active driver.

**Drivers exported**: `ClientStorage`, `BaseStorage`, `BrowserStorage`, `CookiesStorage`, `JSStorage`.

**TS**: Full types included. See `index.d.ts`. Use with `import type { ClientStorage } from 'ClientStorage';`

### Examples

```js
const storage = new ClientStorage();

storage.set('locale', 'en');
storage.set('user', { id: 1, prefs: { theme: 'dark' } }, 3600); // 1hr TTL
storage.set('flag', true);

console.log(storage.get('user')); // {id:1, prefs:...}
console.log(storage.has('locale')); // true
console.log(storage.keys()); // ['locale', 'user', 'flag']

storage.remove('locale');
storage.empty(); // clears all
```

**With TTL**:
```js
storage.set('session', 'secret', 30); // expires in 30s
// After expiry: get/has return undefined, auto-removed.
```

**Specific driver**:
```js
const cookiesOnly = new ClientStorage('cookies');
const memOnly = new ClientStorage('js');
```

**Multiple instances**: Persistent drivers (localStorage/cookies) share data; js is per-instance.

## Tests

- **Jest** (NPM): `npm test` — covers API, edges, errors, drivers, BaseStorage.

```shell
npm test
```

100% functional coverage. See `client-storage-tests.js`, `tests/client-storage.test.js`.

## Support this project:

- Upload and share files using [☄️ meteor-files.com](https://meteor-files.com/?ref=github-clientstorage-repo-footer) — Continue interrupted file uploads without losing any progress. There is nothing that will stop Meteor from delivering your file to the desired destination
- Use [▲ ostr.io](https://ostr.io?ref=github-clientstorage-repo-footer) for [Server Monitoring](https://snmp-monitoring.com), [Web Analytics](https://ostr.io/info/web-analytics?ref=github-clientstorage-repo-footer), [WebSec](https://domain-protection.info), [Web-CRON](https://web-cron.info) and [SEO Pre-rendering](https://prerendering.com) of a website
- Star on [GitHub](https://github.com/veliovgroup/Client-Storage)
- Star on [NPM](https://www.npmjs.com/package/Client-Storage)
- Star on [Atmosphere](https://atmospherejs.com/ostrio/cstorage)
- [Sponsor via GitHub](https://github.com/sponsors/dr-dimitru)
- [Support via PayPal](https://paypal.me/veliovgroup)
