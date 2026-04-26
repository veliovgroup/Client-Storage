Package.describe({
  name: 'ostrio:cstorage',
  version: '5.0.0',
  summary: 'Bulletproof persistent Client (Browser) storage with drivers (localStorage/cookies/js), TTL, full TypeScript defs. Works with disabled storage.',
  git: 'https://github.com/veliovgroup/Client-Storage',
  documentation: 'README.md'
});

Package.onUse((api) => {
  api.versionsFrom('1.4');
  api.use('ecmascript');
  api.mainModule('client-storage.js');
});

Package.onTest((api) => {
  api.use('tinytest');
  api.use('ecmascript');
  api.addFiles('client-storage-tests.js');
});
