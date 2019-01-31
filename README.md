# Persistent Client (Browser) Storage

- 😎 No external dependencies;
- 💪 Bulletproof persistent Client storage;
- ㊗️ Support for Unicode values and keys;
- 👨‍💻 Support for `String`, `Array`, `Object`, and `Boolean` as values;
- ♿︎ Works with disabled `localStorage` and `cookies`;
- 👷‍♂️ __100%__ tests coverage.

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

- `.get({String})` - `ClientStorage.get('key')` - Read a record. If the key doesn't exist a null value will be returned;
- `.get({String}, {String|[mix]|Boolean|Object})` - `ClientStorage.set('key', value)` - Create/overwrite a value in storage;
- `.remove({String})` - `ClientStorage.remove('key')` - Remove a record;
- `.has({String})` - `ClientStorage.has('key')` - Check whether a record exists, returns a boolean value;
- `.keys()` - `ClientStorage.keys()` - Returns an array of all storage keys;
- `.empty()` -  `ClientStorage.empty()` - Empty storage (remove all key/value pairs). __Use with caution! (*May remove cookies which weren't set by you*)__.

## Alternate usage:

### Use `cookies` only:

To use `cookies` as a driver for `ClientStorage` create new instance of `clientStorage` (*camel-case, first letter __lower-case__*):

```js
var clientStorage  = require('ClientStorage').clientStorage;
var csCookies = new clientStorage('cookies');
```

or in ES6 (Meteor):

```js
import { clientStorage } from 'meteor/ostrio:cstorage';
const csLocalStorage = new clientStorage('cookies');
```

### Use `localStorage` only:

To use `localStorage` as a driver for `ClientStorage` create new instance of `clientStorage` (*camel-case, first letter __lower-case__*):

```js
var clientStorage  = require('ClientStorage').clientStorage;
var csLocalStorage = new clientStorage('localStorage');
```

or in ES6 (Meteor):

```js
import { clientStorage } from 'meteor/ostrio:cstorage';
const csLocalStorage = new clientStorage('localStorage');
```

__Note:__ *All instances are sharing same cookie and localStorage records!*

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

## Testing:

Meteor/Tinytest

```shell
meteor test-packages ./
# PORT is required, and can be changed to any local open port
```
