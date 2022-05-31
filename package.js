Package.describe({
  name: 'ostrio:cstorage',
  version: '4.0.1',
  summary: 'Bulletproof persistent Client (Browser) storage, works with disabled Cookies and/or localStorage',
  git: 'https://github.com/VeliovGroup/Client-Storage',
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
