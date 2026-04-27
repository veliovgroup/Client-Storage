# Meteor.js Usage for ClientStorage

## Install
```sh
meteor add ostrio:cstorage
# or meteor npm install --save @veliovgroup/client-storage
```

## Import

As Meteor/Atmosphere package

```js
import { ClientStorage } from 'meteor/ostrio:cstorage';
const clientStorage = new ClientStorage();
```

As NPM package

```js
import { ClientStorage } from '@veliovgroup/client-storage';
const clientStorage = new ClientStorage();
```

**Full API and examples in [README.md](../README.md).**

## TypeScript

Atmosphere package includes `index.d.ts` via `zodern:types`.

```ts
import { ClientStorage } from 'meteor/ostrio:cstorage';

const storage = new ClientStorage('localStorage');
const saved: boolean = storage.set('layout', 'two-columns');
const layout: unknown = storage.get('layout');
```

## ReactiveVar Wrapper

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

## Support this project

- Upload and share files using [☄️ meteor-files.com](https://meteor-files.com/?ref=github-clientstorage-repo-footer) — Continue interrupted file uploads without losing any progress. There is nothing that will stop Meteor from delivering your file to the desired destination
- Use [▲ ostr.io](https://ostr.io?ref=github-clientstorage-repo-footer) for [Server Monitoring](https://snmp-monitoring.com), [Web Analytics](https://ostr.io/info/web-analytics?ref=github-clientstorage-repo-footer), [WebSec](https://domain-protection.info), [Web-CRON](https://web-cron.info) and [SEO Pre-rendering](https://prerendering.com) of a website
- Star on [GitHub](https://github.com/veliovgroup/client-storage)
- Star on [NPM](https://www.npmjs.com/package/@veliovgroup/client-storage)
- Star on [Atmosphere](https://atmospherejs.com/ostrio/cstorage)
- [Sponsor via GitHub](https://github.com/sponsors/dr-dimitru)
- [Support via PayPal](https://paypal.me/veliovgroup)
