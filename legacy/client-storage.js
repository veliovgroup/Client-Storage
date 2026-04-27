import ClientStorage, {
  BaseStorage,
  BrowserStorage,
  CookiesStorage,
  JSStorage
} from '@veliovgroup/client-storage';

if (typeof globalThis.__ClientStorageLegacyShimWarning === 'undefined' && typeof console !== 'undefined' && console.warn) {
  console.warn('DEPRECATED: `ClientStorage` is deprecated. Install and use `@veliovgroup/client-storage` instead.');
  globalThis.__ClientStorageLegacyShimWarning = true;
}

export {
  BaseStorage,
  BrowserStorage,
  CookiesStorage,
  JSStorage
};
export { ClientStorage };
export default ClientStorage;
