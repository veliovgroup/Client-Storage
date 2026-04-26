## Preferences
- Behavior-preserving refactors only unless explicit functional change allowed.
- Plan-driven: complete all todos in order. Mark `in_progress` at start. Never edit plan file.
- Terse technical responses. Drop articles, fillers, pleasantries, hedging. Fragments OK.
- Use TodoWrite for complex/multi-step. Mark completed immediately.

## Project
- `npm-client-storage`: `ClientStorage`. Bulletproof browser persistent storage. Drivers (localStorage > cookies > js in-mem fallback). TTL, JSON values (obj/array/bool/null/undef), Unicode, no deps. Meteor + NPM + full TS.
- Core impl: `client-storage.js` (facade, driver selection, mixin), `base-storage.js` (TTL/cache/shared), `browser-storage.js`, `cookies-storage.js`, `js-storage.js`, `helpers.js` (escape/JSON/Unicode).
- Config: `package.json` (exports for ESM/CJS, types, files list, scripts: build:rollup+types, test:jest, test:meteor, typecheck:tsc), `rollup.config.js` (CJS from ESM), `tsconfig.json` (check JS+types), `tsconfig.types.json`, `index.d.ts` (interfaces+classes), `package.js` (Meteor pkg).
- Docs: `README.md` (API/usage), `docs/meteor.md` (Meteor.js specific usage).
- Lifecycle: `npm run build` before publish (`prepublishOnly`), sync version package.json+package.js, maintain 100% coverage.

## JS/NPM Best Practices
- ESM-first (`"type":"module"`), dual exports (import/require w/ types), Rollup for CJS compat.
- Modular, no side-effects, strict, edge-case handling (server fallback to JSStorage, disabled storage).
- No deps. Precise files in package.json. TS strict, JSDoc in sources.
- Tests: Jest (NPM/browser), Meteor Tinytest. Run both.
- Releases: update version, build, test, update README if API changes.

## Guardrails
- ALWAYS respect .cursorignore: avoid editing, indexing, interacting with its files (node_modules, client-storage.cjs, package-lock.json, *.map, old docs CHANGELOG/HISTORY/CODE_OF_CONDUCT, coverage/, .cursor/*, .npmignore, LICENSE variants, etc.).
- Read before edit (use Read first). StrReplace/Write for changes. Run ReadLints post-edit, fix issues.
- Prefer Shell for test/build only. No proactive commits. Use Task subagents if needed.
- .cursorignore listed files stay untouched to prevent indexing bloat/generated conflicts.
- For resume dev: check git status, run `npm test && npm run test:meteor`, verify build, update AGENTS.md only for guidelines.

## Key Commands
- `npm run build`
- `npm test`
- `npm run test:meteor`
- `npm run typecheck`
