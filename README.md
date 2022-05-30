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
- Available via [📦 NPM](https://www.npmjs.com/package/ClientStorage) and [☄️ Atmosphere](https://atmospherejs.com/ostrio/cstorage).

![ClientStorage NPM library logo](https://raw.githubusercontent.com/VeliovGroup/Client-Storage/master/cover.jpg)

## Install:

```shell
npm install --save ClientStorage
```

### Install Meteor:

```shell
# Via Atmosphere
meteor add ostrio:cstorage
```

```shell
# Via NPM
meteor npm install --save ClientStorage
```

### Require:

```js
var ClientStorage = require('ClientStorage').ClientStorage;
var clientStorage = new ClientStorage();
```

### ES6 Import:

```js
import { ClientStorage } from 'ClientStorage';
const clientStorage = new ClientStorage();
```

### ES6 Import (Meteor):

```js
import { ClientStorage } from 'meteor/ostrio:cstorage';
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

## Alternate usage:

By default ClientStorage package handle selecting storage driver in the next order (descending priority):

1. `localStorage`
2. `cookies`
3. `js` (*JS Object driven storage*)

To alter priority pass "preferred driver" to `new ClientStorage(driverName)` constructor.

### Use `cookies` only:

Pass `cookies` as an argument to new instance of `ClientStorage`:

```js
const { clientStorage } = require('ClientStorage');
var cookiesStorage = new ClientStorage('cookies');
cookiesStorage.has('locale'); // false
cookiesStorage.set('locale', 'en_US'); // true
```

### Use `localStorage` only:

Pass `localStorage` as an argument to new instance of `ClientStorage`:

```js
const { clientStorage } = require('ClientStorage');
var locStorage = new ClientStorage('localStorage');
locStorage.has('locale'); // false
locStorage.set('locale', 'en_US'); // true
```

### Use `js` only:

Pass `js` (*in-memory js object*) as an argument to new instance of `ClientStorage`:

```js
const { clientStorage } = require('ClientStorage');
var jsStorage = new ClientStorage('js');
jsStorage.has('locale'); // false
jsStorage.set('locale', 'en_US'); // true
```

__Note:__ *All instances are sharing same cookie and localStorage records!*

## [Meteor] Add reactivity:

Persistent `ReactiveVar` implementation:

```js
import { ReactiveVar } from 'meteor/reactive-var';
import { ClientStorage } from 'meteor/ostrio:cstorage';
const clientStorage = new ClientStorage();

const persistentReactive = (name, initial = undefined) => {
  let reactive;
  if (clientStorage.has(name)) {
    reactive = new ReactiveVar(clientStorage.get(name));
  } else {
    clientStorage.set(name, initial);
    reactive = new ReactiveVar(initial);
  }

  reactive.set = function (newValue) {
    let oldValue = reactive.curValue;
    if ((reactive.equalsFunc || ReactiveVar._isEqual)(oldValue, newValue)) {
      return;
    }
    reactive.curValue = newValue;
    clientStorage.set(name, newValue);
    reactive.dep.changed();
  };

  return reactive;
};

const layout = persistentReactive('ui-layout', 'two-columns');
layout.get(); // two-columns
layout.set('single-column');
```

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

1. Clone this package
2. In Terminal (*Console*) go to directory where package is cloned
3. Then run:

### Meteor/Tinytest

```shell
# Default
meteor test-packages ./

# With custom port
meteor test-packages ./ --port 8888

# With local MongoDB and custom port
MONGO_URL="mongodb://127.0.0.1:27017/client-storage-tests" meteor test-packages ./ --port 8888
```

## Support this project:

- [Sponsor via GitHub](https://github.com/sponsors/dr-dimitru)
- [Support via PayPal](https://paypal.me/veliovgroup)
- Use [ostr.io](https://ostr.io) — [Monitoring](https://snmp-monitoring.com), [Analytics](https://ostr.io/info/web-analytics), [WebSec](https://domain-protection.info), [Web-CRON](https://web-cron.info) and [Pre-rendering](https://prerendering.com) for a website
