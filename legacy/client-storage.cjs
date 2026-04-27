'use strict';

const ClientStoragePackage = require('@veliovgroup/client-storage');
const {
  BaseStorage,
  BrowserStorage,
  CookiesStorage,
  JSStorage
} = ClientStoragePackage;

if (typeof global.__ClientStorageLegacyShimWarning === 'undefined' && typeof console !== 'undefined' && console.warn) {
  console.warn('DEPRECATED: `ClientStorage` is deprecated. Install and use `@veliovgroup/client-storage` instead.');
  global.__ClientStorageLegacyShimWarning = true;
}

module.exports = {
  BaseStorage,
  BrowserStorage,
  CookiesStorage,
  JSStorage,
  ClientStorage: ClientStoragePackage.default,
  default: ClientStoragePackage.default
};
