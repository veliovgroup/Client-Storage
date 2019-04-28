# Persistent Client (Browser) Storage

- 😎 No external dependencies;
- 💪 Bulletproof persistent Client storage;
- ㊗️ With Unicode support for values and keys;
- 👨‍💻 With `String`, `Array`, `Object`, and `Boolean` support as values;
- ♿ Works with disabled `localStorage` and `cookies`;
- 👷‍♂️ __100%__ tests coverage.

![ClientStorage NPM library logo](https://raw.githubusercontent.com/VeliovGroup/Client-Storage/master/ClientStorage-npm-logo.jpg)

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

- `ClientStorage.get('key')` - Read a record. If the key doesn't exist a null value will be returned;
  - `key` - `{String}` - Record's key;
- `ClientStorage.set('key', value, time)` - Create/overwrite a value in storage, optional time to expire in milliseconds;
  - `key` - `{String}` - Record's key;
  - `value` - `{String|[mix]|Boolean|Object}` - Record's value (content);
- `ClientStorage.remove('key')` - Remove a record;
  - `key` - `{String}` - Record's key;
- `ClientStorage.has('key')` - Check whether a record exists, returns a boolean value;
  - `key` - `{String}` - Record's key;
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
meteor test-packages ./
```

## Support our open source contribution:

This project wouldn't be possible without [ostr.io](https://ostr.io).

Using [ostr.io](https://ostr.io) you are not only [protecting domain names](https://ostr.io/info/domain-names-protection), [monitoring websites and servers](https://ostr.io/info/monitoring), using [Prerendering for better SEO](https://ostr.io/info/prerendering) of your JavaScript website, but support our Open Source activity, and great packages like this one are available for free.
