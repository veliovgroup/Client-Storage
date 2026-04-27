## Routing

| Area | Jump |
|------|------|
| Maintaining this repo | [Package development](#package-development) |
| Consuming `ClientStorage` in apps | [ClientStorage in projects](#clientstorage-in-projects) |

---

## Package development

### Preferences
- Behavior-preserving refactors only unless explicit functional change allowed.
- Plan-driven: complete all todos in order. Mark `in_progress` at start. Never edit plan file.
- Terse technical responses. Drop articles, fillers, pleasantries, hedging. Fragments OK.
- Use TodoWrite for complex/multi-step. Mark completed immediately.
- Always respond in English. Do not switch language even when code contains Cyrillic (test data).

### Project
- `npm-client-storage`: `ClientStorage`. Bulletproof browser persistent storage. Drivers (localStorage > cookies > js in-mem fallback). TTL, JSON values (obj/array/bool/null/undef), Unicode, no deps. Meteor + NPM + full TS.
- Core impl: `client-storage.js` (facade, driver selection, mixin), `base-storage.js` (TTL/cache/shared), `browser-storage.js`, `cookies-storage.js`, `js-storage.js`, `helpers.js` (escape/JSON/Unicode).
- Config: `package.json` (exports for ESM/CJS, types, files list, scripts: build:rollup+types, test:jest, test:meteor, typecheck:tsc), `rollup.config.js` (CJS from ESM), `tsconfig.json` (check JS+types), `tsconfig.types.json`, `index.d.ts` (interfaces+classes), `package.js` (Meteor pkg).
- Docs: `README.md` (API/usage), `docs/meteor.md` (Meteor.js specific usage).
- Lifecycle: `npm run build` before publish (`prepublishOnly`), sync version package.json+package.js, maintain 100% coverage.

### JS/NPM best practices
- ESM-first (`"type":"module"`), dual exports (import/require w/ types), Rollup for CJS compat.
- Modular, no side-effects, strict, edge-case handling (server fallback to JSStorage, disabled storage).
- No deps. Precise files in package.json. TS strict, JSDoc in sources.
- Tests: Jest (NPM/browser), Meteor Tinytest. Run both.
- Releases: update version, build, test, update README if API changes.

## JavaScript Guidelines
- Indentation: 2 spaces.
- Strings: single quotes.
- Statements: end lines with `;`.
- Undefined: prefer `void 0` over `undefined` where a value is required (e.g. `return void 0;`).
- Structure: small pure functions for transforms, formatting, validation. Prefer const + arrow or function expression over loose named function declarations when it clarifies scope and ordering.
- Performance: single-pass O(n) where possible; avoid repeated work, nested heavy loops on large data; cache derived values when inputs are few and well-defined.
- Objects/arrays: trailing commas in multiline object/array literals. Extract helpers when nesting gets deep.
- Ternary expressions: inline unless multi-level. Avoid multi-level ternary expressions.
- Prever ES6 style string interpolation to string concatenation.

### Guardrails
- ALWAYS respect .cursorignore: avoid editing, indexing, interacting with its files (node_modules, client-storage.cjs, package-lock.json, *.map, old docs CHANGELOG/HISTORY/CODE_OF_CONDUCT, coverage/, .cursor/*, .npmignore, LICENSE variants, etc.).
- Read before edit (use Read first). StrReplace/Write for changes. Run ReadLints post-edit, fix issues.
- Prefer Shell for test/build only. No proactive commits. Use Task subagents if needed.
- .cursorignore listed files stay untouched to prevent indexing bloat/generated conflicts.
- For resume dev: check git status, run `npm test && npm run test:meteor`, verify build, update AGENTS.md only for guidelines.

### Key commands
- `npm run build`
- `npm test`
- `npm run test:meteor` — browser UI (dev); opens browser
- `npm run test:meteor:console` — headless via `@zodern/mtest` (CI-friendly, exits on completion)
- `npm run typecheck`

---

## ClientStorage in projects

Canonical API + narrative: `README.md`. Meteor: `docs/meteor.md`. Types: `index.d.ts`.

### Install & import

```sh
npm install @veliovgroup/client-storage
```

```js
import { ClientStorage } from '@veliovgroup/client-storage';
// CJS: require('@veliovgroup/client-storage').ClientStorage
```

### Construction & drivers

- `new ClientStorage()` — auto: localStorage → cookies → js.
- `new ClientStorage('localStorage' | 'cookies' | 'js')` — force driver.
- Persistent drivers share data per origin; `js` is in-memory **per instance**. Non-browser / no APIs → behaves like `js`.

### API (quick ref)

- `set(key, value, ttlSeconds?)` → `boolean`
- `get(key)` → value or `undefined` (expired entries removed)
- `has(key)` → `boolean`
- `remove(key?)` / `empty()` — one key or all tracked keys
- `keys()` — non-expired keys
- `driverName` — active driver string

Values JSON-serialized for persistent drivers; supports objects, arrays, primitives, `null`, `undefined`.

### Use-cases

| Need | Pattern |
|------|---------|
| Short-lived token / form draft | `set(k, v, ttlSeconds)` |
| User prefs, locale, theme | `set` without TTL or long TTL; read on boot |
| Feature flags / A/B state | small JSON blobs in `set` |
| Graceful degradation | default constructor; tolerate `undefined` from `get` |
| SSR / Node / tests | expect `js` or implicit fallback; no shared persistence unless you inject same store |
| Strict driver | pass `'localStorage'` etc. when policy requires it |

### How-to notes

- TTL in **seconds**. Expired keys cleaned on `get` / `has`.
- `empty()` / `remove()` clear **tracked** keys for backend; cookie mode may interact with other cookies if prefixing not used — see README cautions.
- Advanced / custom stacks: package exports `BaseStorage`, `BrowserStorage`, `CookiesStorage`, `JSStorage` (see README).
- Type-only import: `import type { ClientStorage } from '@veliovgroup/client-storage';`

When answering user questions about **using** the library in their app, prefer README + `docs/meteor.md` over duplicating long examples here.
