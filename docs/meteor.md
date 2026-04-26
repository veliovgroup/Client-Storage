# Meteor.js Usage for ClientStorage

## Install
```sh
meteor add ostrio:cstorage
# or meteor npm install --save ClientStorage
```

## Import

As Meteor/Atmosphere package

```js
import { ClientStorage } from 'meteor/ostrio:cstorage';
const clientStorage = new ClientStorage();
```

As NPM package

```js
import { ClientStorage } from 'ClientStorage';
const clientStorage = new ClientStorage();
```

**Full API and examples in [README.md](../README.md).**

## Reactivity with ReactiveVar

Improved wrapper (uses storage for persistence):

```js
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';
import { ClientStorage } from 'meteor/ostrio:cstorage';

const persistentReactive = (key, initial = undefined) => {
  const storage = new ClientStorage();
  const rv = new ReactiveVar(
    storage.has(key) ? storage.get(key) : initial
  );

  rv.set = function (newValue) {
    const oldValue = rv.curValue;
    if (Tracker.nonreactive(() => rv.equals(oldValue, newValue))) return;
    rv.curValue = newValue;
    storage.set(key, newValue);
    rv.dep.changed();
  };

  return rv;
};

// Usage
const layout = persistentReactive('ui-layout', 'two-columns');
console.log(layout.get()); // two-columns
layout.set('single-column'); // persists + reactive
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

Uses Tinytest. Covers all drivers, TTL async, Unicode, objects, edges. Jest for NPM side.

See [README.md](../README.md) for general usage.

## Support this project:

- [Sponsor via GitHub](https://github.com/sponsors/dr-dimitru)
- [Support via PayPal](https://paypal.me/veliovgroup)
- Use [ostr.io](https://ostr.io) — [Monitoring](https://snmp-monitoring.com), [Analytics](https://ostr.io/info/web-analytics), [WebSec](https://domain-protection.info), [Web-CRON](https://web-cron.info) and [Pre-rendering](https://prerendering.com) for a website
