# Major Release Migration

## Migration v5

**Version 5** has major change — package rename from `ClientStorage` to `@veliovgroup/client-storage`.

### Update existing apps

```sh
npm uninstall ClientStorage
npm install @veliovgroup/client-storage
```

```js
import { ClientStorage } from '@veliovgroup/client-storage';
```

### Legacy alias install

For one release window, old import names can remain via npm alias:

```sh
npm install ClientStorage@npm:@veliovgroup/client-storage
```

### Maintainer migration flow

For package release migration:

```sh
npm run build
npm publish
npm run publish:legacy-shim
npm run deprecate:legacy
```