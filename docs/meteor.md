[![support](https://img.shields.io/badge/support-GitHub-white)](https://github.com/sponsors/dr-dimitru)
[![support](https://img.shields.io/badge/support-PayPal-white)](https://paypal.me/veliovgroup)
<a href="https://ostr.io/info/built-by-developers-for-developers">
  <img src="https://ostr.io/apple-touch-icon-60x60.png" height="20">
</a>

ClientStorage package can be installed and used within [Meteor.js](https://docs.meteor.com/) as [NPM](https://www.npmjs.com/package/ClientStorage) or [Atmosphere](https://atmospherejs.com/ostrio/cstorage) package

# Persistent Browser (Client) Storage

- 👷 __100% Tests coverage__;
- 📦 No external dependencies;
- 💪 Bulletproof persistent Client storage;
- ㊗️ With Unicode support for values and keys;
- 👨‍💻 With `String`, `Array`, `Object`, and `Boolean` support as values;
- ♿ Works with disabled `localStorage` and `cookies`;
- Available via [📦 NPM](https://www.npmjs.com/package/ClientStorage) and [☄️ Atmosphere](https://atmospherejs.com/ostrio/cstorage).

![ClientStorage NPM library logo](https://raw.githubusercontent.com/VeliovGroup/Client-Storage/master/cover.jpg)

### Install

As Meteor package

```shell
# Via Atmosphere
meteor add ostrio:cstorage
```

As NPM package

```shell
# Via NPM
meteor npm install --save ClientStorage
```

### Import:

As Meteor package

```js
import { ClientStorage } from 'meteor/ostrio:cstorage';
const clientStorage = new ClientStorage();
```

As NPM package

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

## Add reactivity:

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
