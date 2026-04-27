Package.describe({
  name: 'ostrio:cstorage',
  version: '5.0.0',
  summary: 'Bulletproof persistent Browser storage with drivers (localstorage/cookies/js), TTL, full TS defs',
  git: 'https://github.com/veliovgroup/client-storage',
  documentation: 'README.md'
});

Package.onUse((api) => {
  api.versionsFrom(['1.4', '2.8.0', '3.0.1', '3.4']);
  api.use('ecmascript');
  api.use(['typescript', 'zodern:types@1.0.13'], ['client', 'server'], { weak: true });
  api.addAssets('index.d.ts', ['server', 'client']);
  api.mainModule('client-storage.js');
});

Package.onTest((api) => {
  api.use(['tinytest', 'ecmascript', 'zodern:types', 'typescript'], ['client', 'server']);
  api.addFiles('client-storage-tests.js');
});
