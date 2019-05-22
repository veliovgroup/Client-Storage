# Persistent Client (Browser) Storage

<a href="https://www.patreon.com/bePatron?u=20396046">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

- 👷 __100% Tests coverage__;
- 📦 No external dependencies;
- 💪 Bulletproof persistent Client storage;
- ㊗️ With Unicode support for values and keys;
- 👨‍💻 With `String`, `Array`, `Object`, and `Boolean` support as values;
- ♿ Works with disabled `localStorage` and `cookies`.

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
```

### ES6 Import (Meteor):

```js
import { ClientStorage } from 'meteor/ostrio:cstorage';
```

## Usage:

- `ClientStorage.get('key')` - Read a record. If the key doesn't exist a *undefined* value will be returned;
  - `key` - {*String*} - Record's key;
- `ClientStorage.set('key', value[, ttl])` - Create/overwrite a value in storage;
  - `key` - {*String*} - Record's key;
  - `value` - {*String*|[*mix*]|*Boolean*|*Object*} - Record's value (content);
  - `ttl` - {*Number*} — [Optional] Record's TTL in seconds;
- `ClientStorage.remove('key')` - Remove a record;
  - `key` - {*String*} - Record's key;
- `ClientStorage.has('key')` - Check whether a record exists, returns a boolean value;
  - `key` - {*String*} - Record's key;
- `ClientStorage.keys()` - Returns an array of all storage keys;
- `ClientStorage.empty()` - Empty storage (remove all key/value pairs). __Use with caution! (*May remove cookies which weren't set by you*)__.

## Alternate usage:

### Use `cookies` only:

To use `cookies` as a driver for `ClientStorage` create new instance of `clientStorage` (*camel-case, first letter __lower-case__*):

```js
var clientStorage  = require('ClientStorage').clientStorage;
var csCookies = new clientStorage('cookies');
csCookies.has('locale'); // false
csCookies.set('locale', 'en_US'); // true
```

or in ES6 (Meteor):

```js
import { clientStorage } from 'meteor/ostrio:cstorage';
const csLocalStorage = new clientStorage('cookies');
csLocalStorage.has('locale'); // false
csLocalStorage.set('locale', 'en_US'); // true
```

### Use `localStorage` only:

To use `localStorage` as a driver for `ClientStorage` create new instance of `clientStorage` (*camel-case, first letter __lower-case__*):

```js
var clientStorage  = require('ClientStorage').clientStorage;
var csLocalStorage = new clientStorage('localStorage');
csLocalStorage.has('locale'); // false
csLocalStorage.set('locale', 'en_US'); // true
```

or in ES6 (Meteor):

```js
import { clientStorage } from 'meteor/ostrio:cstorage';
const csLocalStorage = new clientStorage('localStorage');
csLocalStorage.has('locale'); // false
csLocalStorage.set('locale', 'en_US'); // true
```

__Note:__ *All instances are sharing same cookie and localStorage records!*

## [Meteor] Add reactivity:

```js
import { ReactiveVar }   from 'meteor/reactive-var';
import { ClientStorage } from 'meteor/ostrio:cstorage';

const persistentReactive = (name, initial = false) => {
  let reactive;
  if (ClientStorage.has(name)) {
    reactive = new ReactiveVar(ClientStorage.get(name));
  } else {
    ClientStorage.set(name, initial);
    reactive = new ReactiveVar(initial);
  }

  reactive.set = function (newValue) {
    let oldValue = reactive.curValue;
    if ((reactive.equalsFunc || ReactiveVar._isEqual)(oldValue, newValue)) {
      return;
    }
    reactive.curValue = newValue;
    ClientStorage.set(name, newValue);
    reactive.dep.changed();
  };

  return reactive;
};

const UILayout = persistentReactive('UILayout', 'two-columns');
UILayout.get(); // two-columns
UILayout.set('single-column');
```

## Examples:

```js
var ClientStorage = require('ClientStorage').ClientStorage;

ClientStorage.set('locale', 'en'); // true
ClientStorage.set('country', 'usa'); // true
ClientStorage.set('gender', 'male'); // true

ClientStorage.get('gender'); // male

ClientStorage.has('locale'); // true
ClientStorage.has('city'); // false

ClientStorage.keys(); // ['locale', 'country', 'gender']

ClientStorage.remove('locale'); // true
ClientStorage.get('locale'); // undefined

ClientStorage.keys(); // ['country', 'gender']

ClientStorage.empty(); // true
ClientStorage.keys(); // []

ClientStorage.empty(); // false
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

- [Become a patron](https://www.patreon.com/bePatron?u=20396046) — support my open source contributions with monthly donation
- Use [ostr.io](https://ostr.io) — [Monitoring](https://snmp-monitoring.com), [Analytics](https://ostr.io/info/web-analytics), [WebSec](https://domain-protection.info), [Web-CRON](https://web-cron.info) and [Pre-rendering](https://prerendering.com) for a website
