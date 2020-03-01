Package.describe({
  name: 'ostrio:cstorage',
  version: '3.0.1',
  summary: 'Bulletproof persistent Client (Browser) storage, works with disabled Cookies and/or localStorage',
  git: 'https://github.com/VeliovGroup/Client-Storage',
  documentation: 'README.md'
});

Package.onUse((api) => {
  api.versionsFrom('1.4');
  api.use('ecmascript', 'client');
  api.mainModule('client-storage.js', 'client');
});

Package.onTest((api) => {
  api.use('tinytest');
  api.use('ecmascript', 'client');
  api.addFiles('client-storage-tests.js', 'client');
});
