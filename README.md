[![support](https://img.shields.io/badge/support-GitHub-white)](https://github.com/sponsors/dr-dimitru)
[![support](https://img.shields.io/badge/support-PayPal-white)](https://paypal.me/veliovgroup)
<a href="https://ostr.io/info/built-by-developers-for-developers">
  <img src="https://ostr.io/apple-touch-icon-60x60.png" height="20">
</a>

# Persistent Browser (Client) Storage

- 👷 __100% Tests coverage__;
- 📦 No external dependencies;
- 💪 Bulletproof persistent Client storage;
- ㊗️ With Unicode support for values and keys;
- 👨‍💻 With `String`, `Array`, `Object`, and `Boolean` support as values;
- ♿ Works with disabled `localStorage` and `cookies`;
- ☄️ [Meteor.js-specific docs](https://github.com/veliovgroup/Client-Storage/blob/master/docs/meteor.md)
- 📦 Available via [NPM](https://www.npmjs.com/package/ClientStorage) and [Atmosphere](https://atmospherejs.com/ostrio/cstorage).

![ClientStorage NPM library logo](https://raw.githubusercontent.com/veliovgroup/Client-Storage/master/cover.jpg)

## Install:

```shell
npm install --save ClientStorage
```

### Require:

```js
const ClientStorage = require('ClientStorage').ClientStorage;
const clientStorage = new ClientStorage();
```

### ES6 Import:

```js
import { ClientStorage } from 'ClientStorage';
const clientStorage = new ClientStorage();
```


## Usage:

- `clientStorage.get('key')` - Read a record. If the key doesn't exist a *undefined* value will be returned;
  - `key` - {*String*} - Record's key;
- `clientStorage.set('key', value[, ttl])` - Create/overwrite a value in storage;
  - `key` - {*String*} - Record's key;
  - `value` - {*String*|[*mix*]|*Boolean*|*Object*} - Record's value (content);
  - `ttl` - {*Number*} — [Optional] Record's TTL in seconds;
- `clientStorage.remove('key')` - Remove a record;
  - `key` - {*String*} - Record's key;
- `clientStorage.has('key')` - Check whether a record exists, returns a boolean value;
  - `key` - {*String*} - Record's key;
- `clientStorage.keys()` - Returns an array of all storage keys;
- `clientStorage.empty()` - Empty storage (remove all key/value pairs). __Use with caution! (*May remove cookies which weren't set by you*)__.

## Storage-specific usage:

By default ClientStorage package handle selecting storage driver in the next order (descending priority):

1. `localStorage`
2. `cookies`
3. `js` (*JS Object driven storage*)

To alter priority pass "preferred driver" to `new ClientStorage(driverName)` constructor.

### Use `cookies` only:

Pass `cookies` as an argument to new instance of `ClientStorage`:

```js
const { clientStorage } = require('ClientStorage');
const cookiesStorage = new ClientStorage('cookies');
cookiesStorage.has('locale'); // false
cookiesStorage.set('locale', 'en_US'); // true
```

### Use `localStorage` only:

Pass `localStorage` as an argument to new instance of `ClientStorage`:

```js
const { clientStorage } = require('ClientStorage');
const locStorage = new ClientStorage('localStorage');
locStorage.has('locale'); // false
locStorage.set('locale', 'en_US'); // true
```

### Use `js` only:

Pass `js` (*in-memory js object*) as an argument to new instance of `ClientStorage`:

```js
const { clientStorage } = require('ClientStorage');
const jsStorage = new ClientStorage('js');
jsStorage.has('locale'); // false
jsStorage.set('locale', 'en_US'); // true
```

__Note:__ *All instances are sharing same cookie and localStorage records!*

## Examples:

```js
const clientStorage = new (require('ClientStorage').ClientStorage);

clientStorage.set('locale', 'en'); // true
clientStorage.set('country', 'usa'); // true
clientStorage.set('gender', 'male'); // true

clientStorage.get('gender'); // male

clientStorage.has('locale'); // true
clientStorage.has('city'); // false

clientStorage.keys(); // ['locale', 'country', 'gender']

clientStorage.remove('locale'); // true
clientStorage.get('locale'); // undefined

clientStorage.keys(); // ['country', 'gender']

clientStorage.empty(); // true
clientStorage.keys(); // []

clientStorage.empty(); // false
```

## Running Tests

Tests are written using Tiny, follow testing instruction in [meteor docs](https://github.com/veliovgroup/Client-Storage/blob/master/docs/meteor.md#running-tests)

## Support this project:

- [Sponsor via GitHub](https://github.com/sponsors/dr-dimitru)
- [Support via PayPal](https://paypal.me/veliovgroup)
- Use [ostr.io](https://ostr.io) — [Monitoring](https://snmp-monitoring.com), [Analytics](https://ostr.io/info/web-analytics), [WebSec](https://domain-protection.info), [Web-CRON](https://web-cron.info) and [Pre-rendering](https://prerendering.com) for a website
