import { ClientStorage, clientStorage } from 'meteor/ostrio:cstorage';

Tinytest.add('ClientStorage - set() / get() / has() - Void (Should fail for localStorage)', function (test) {
  ClientStorage.empty();
  var testVal = void 0;
  var setRes = ClientStorage.set('Void', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorage.has('Void'));
  test.isUndefined(ClientStorage.get('Void'));
  ClientStorage.empty();
});

Tinytest.add('ClientStorage - set() / get() - String', function (test) {
  ClientStorage.empty();
  var testVal = 'this is test value';
  var setRes = ClientStorage.set('teststorage', testVal);
  test.isTrue(setRes);
  test.equal(ClientStorage.get('teststorage'), testVal);
  ClientStorage.empty();
});

Tinytest.add('ClientStorage - set() / get() / has() - Cyrillic', function (test) {
  ClientStorage.empty();
  var testVal = 'Ключ и значение';
  var setRes = ClientStorage.set('Кириллица', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorage.has('Кириллица'));
  test.isFalse(ClientStorage.has('ДругойКлюч'));
  test.equal(ClientStorage.get('Кириллица'), testVal);
  ClientStorage.empty();
});

Tinytest.add('ClientStorage - set() / get() / has() - Unicode', function (test) {
  ClientStorage.empty();
  var testVal = '⦶';
  var setRes = ClientStorage.set('⦁', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorage.has('⦁'));
  test.isFalse(ClientStorage.has('⦁⦁⦁'));
  test.equal(ClientStorage.get('⦁'), testVal);
  ClientStorage.empty();
});

Tinytest.add('ClientStorage - set() / get() - Object and Array', function (test) {
  ClientStorage.empty();
  var one = [1, 'one'];
  var two = {two: 2};
  var three = [{three: ['one', 'two', {'three': 3}]}];
  var setResOne = ClientStorage.set('teststorageOne', one);
  var setResTwo = ClientStorage.set('teststorageTwo', two);
  var setResThree = ClientStorage.set('teststorageThree', three);

  test.isTrue(setResOne);
  test.isTrue(setResTwo);
  test.isTrue(setResThree);

  test.equal(ClientStorage.get('teststorageOne'), one);
  test.equal(ClientStorage.get('teststorageTwo'), two);
  test.equal(ClientStorage.get('teststorageThree'), three);

  ClientStorage.empty();
});

Tinytest.add('ClientStorage - set() / get() / has() - FALSE', function (test) {
  var testVal = false;
  var setRes = ClientStorage.set('testFalse', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorage.has('testFalse'));
  test.equal(ClientStorage.get('testFalse'), testVal);
});

Tinytest.add('ClientStorage - set() / get() / has() - TRUE', function (test) {
  var testVal = true;
  var setRes = ClientStorage.set('testTrue', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorage.has('testTrue'));
  test.equal(ClientStorage.get('testTrue'), testVal);
});

Tinytest.add('ClientStorage - set() / get() / has() - NULL', function (test) {
  var testVal = null;
  var setRes = ClientStorage.set('testNull', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorage.has('testNull'));
  test.equal(ClientStorage.get('testNull'), testVal);
});

Tinytest.add('ClientStorage - get() - non existent value', function (test) {
  ClientStorage.empty();
  test.isUndefined(ClientStorage.get('non-existent-key'));
  ClientStorage.empty();
});

Tinytest.add('ClientStorage - remove() - non existent value', function (test) {
  ClientStorage.empty();
  var removeRes = ClientStorage.remove('1234567890asdfghjk');
  test.isFalse(removeRes);
  ClientStorage.empty();
});

Tinytest.add('ClientStorage - empty() - ALL', function (test) {
  ClientStorage.empty();
  var setResOne = ClientStorage.set('teststorageOne', 'One');
  var setResTwo = ClientStorage.set('teststorageTwo', 'Two');
  var removeRes = ClientStorage.empty();

  test.isTrue(removeRes);
  test.equal(ClientStorage.keys(), []);

  removeRes = ClientStorage.empty();
  test.isFalse(removeRes);
});

Tinytest.add('ClientStorage - keys() / has() / remove() - String', function (test) {
  ClientStorage.empty();
  var setResOne = ClientStorage.set('teststorageOne', 'One');
  var setResTwo = ClientStorage.set('teststorageTwo', 'Two');

  test.isTrue(!!~ClientStorage.keys().indexOf('teststorageOne'));
  test.isTrue(!!~ClientStorage.keys().indexOf('teststorageTwo'));

  test.isTrue(ClientStorage.has('teststorageOne'));
  test.isTrue(ClientStorage.has('teststorageTwo'));

  var removeRes = ClientStorage.remove('teststorageOne');
  test.isTrue(removeRes);

  test.isFalse(ClientStorage.has('teststorageOne'));
  test.isTrue(ClientStorage.has('teststorageTwo'));
  ClientStorage.empty();
});

//////////////
// Cookies only
//////////////
var ClientStorageCookies = new clientStorage('cookies');

Tinytest.add('ClientStorage - Cookies - set() / get() / has() - Void', function (test) {
  ClientStorageCookies.empty();
  var testVal = void 0;
  var setRes = ClientStorageCookies.set('Void', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorageCookies.has('Void'));
  test.isUndefined(ClientStorageCookies.get('Void'));
  ClientStorageCookies.empty();
});

Tinytest.add('ClientStorage - Cookies - set() / get() - String', function (test) {
  ClientStorageCookies.empty();
  var testVal = 'this is test value';
  var setRes = ClientStorageCookies.set('teststorage', testVal);
  test.isTrue(setRes);
  test.equal(ClientStorageCookies.get('teststorage'), testVal);
  ClientStorageCookies.empty();
});

Tinytest.add('ClientStorage - Cookies - set() / get() / has() - Cyrillic', function (test) {
  ClientStorageCookies.empty();
  var testVal = 'Ключ и значение';
  var setRes = ClientStorageCookies.set('Кириллица', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorageCookies.has('Кириллица'));
  test.isFalse(ClientStorageCookies.has('ДругойКлюч'));
  test.equal(ClientStorageCookies.get('Кириллица'), testVal);
  ClientStorageCookies.empty();
});

Tinytest.add('ClientStorage - Cookies - set() / get() / has() - Unicode', function (test) {
  ClientStorageCookies.empty();
  var testVal = '⦶';
  var setRes = ClientStorageCookies.set('⦁', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorageCookies.has('⦁'));
  test.isFalse(ClientStorageCookies.has('⦁⦁⦁'));
  test.equal(ClientStorageCookies.get('⦁'), testVal);
  ClientStorageCookies.empty();
});

Tinytest.add('ClientStorage - Cookies - set() / get() / has() - FALSE', function (test) {
  var testVal = false;
  var setRes = ClientStorageCookies.set('testFalse', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorageCookies.has('testFalse'));
  test.equal(ClientStorageCookies.get('testFalse'), testVal);
});

Tinytest.add('ClientStorage - Cookies - set() / get() / has() - TRUE', function (test) {
  var testVal = true;
  var setRes = ClientStorageCookies.set('testTrue', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorageCookies.has('testTrue'));
  test.equal(ClientStorageCookies.get('testTrue'), testVal);
});

Tinytest.add('ClientStorage - Cookies - set() / get() / has() - NULL', function (test) {
  var testVal = null;
  var setRes = ClientStorageCookies.set('testNull', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorageCookies.has('testNull'));
  test.equal(ClientStorageCookies.get('testNull'), testVal);
});

Tinytest.add('ClientStorage - Cookies - set() / get() - Object and Array', function (test) {
  ClientStorageCookies.empty();
  var one = [1, 'one'];
  var two = {two: 2};
  var three = [{three: ['one', 'two', {'three': 3}]}];
  var setResOne = ClientStorageCookies.set('teststorageOne', one);
  var setResTwo = ClientStorageCookies.set('teststorageTwo', two);
  var setResThree = ClientStorageCookies.set('teststorageThree', three);

  test.isTrue(setResOne);
  test.isTrue(setResTwo);
  test.isTrue(setResThree);
  
  test.equal(ClientStorageCookies.get('teststorageOne'), one);
  test.equal(ClientStorageCookies.get('teststorageTwo'), two);
  test.equal(ClientStorageCookies.get('teststorageThree'), three);

  ClientStorageCookies.empty();
});

Tinytest.add('ClientStorage - Cookies - get() - non existent value', function (test) {
  ClientStorageCookies.empty();
  test.isUndefined(ClientStorageCookies.get('non-existent-key'));
  ClientStorageCookies.empty();
});

Tinytest.add('ClientStorage - Cookies - remove() - non existent value', function (test) {
  ClientStorageCookies.empty();
  var removeRes = ClientStorageCookies.remove('1234567890asdfghjk');
  test.isFalse(removeRes);
  ClientStorageCookies.empty();
});

Tinytest.add('ClientStorage - Cookies - empty() - ALL', function (test) {
  ClientStorageCookies.empty();
  var setResOne = ClientStorageCookies.set('teststorageOne', 'One');
  var setResTwo = ClientStorageCookies.set('teststorageTwo', 'Two');
  var removeRes = ClientStorageCookies.empty();

  test.isTrue(removeRes);
  test.equal(ClientStorageCookies.keys(), []);

  removeRes = ClientStorageCookies.empty();
  test.isFalse(removeRes);
});

Tinytest.add('ClientStorage - Cookies - keys() / has() / remove() - String', function (test) {
  ClientStorageCookies.empty();
  var setResOne = ClientStorageCookies.set('teststorageOne', 'One');
  var setResTwo = ClientStorageCookies.set('teststorageTwo', 'Two');

  test.isTrue(!!~ClientStorageCookies.keys().indexOf('teststorageOne'));
  test.isTrue(!!~ClientStorageCookies.keys().indexOf('teststorageTwo'));

  test.isTrue(ClientStorageCookies.has('teststorageOne'));
  test.isTrue(ClientStorageCookies.has('teststorageTwo'));

  var removeRes = ClientStorageCookies.remove('teststorageOne');
  test.isTrue(removeRes);

  test.isFalse(ClientStorageCookies.has('teststorageOne'));
  test.isTrue(ClientStorageCookies.has('teststorageTwo'));
  ClientStorageCookies.empty();
});

//////////////
// LocalStorage only
//////////////
var ClientStorageLS = new clientStorage('localStorage');

Tinytest.add('ClientStorage - LocalStorage - set() / get() / has() - Void (localStorage can\'t store undefined)', function (test) {
  ClientStorageLS.empty();
  var testVal = void 0;
  var setRes = ClientStorageLS.set('Void', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorageLS.has('Void'));
  test.isUndefined(ClientStorageLS.get('Void'));
  ClientStorageLS.empty();
});

Tinytest.add('ClientStorage - LocalStorage - set() / get() - String', function (test) {
  ClientStorageLS.empty();
  var testVal = 'this is test value';
  var setRes = ClientStorageLS.set('teststorage', testVal);
  test.isTrue(setRes);
  test.equal(ClientStorageLS.get('teststorage'), testVal);
  ClientStorageLS.empty();
});

Tinytest.add('ClientStorage - LocalStorage - set() / get() / has() - Cyrillic', function (test) {
  ClientStorageLS.empty();
  var testVal = 'Ключ и значение';
  var setRes = ClientStorageLS.set('Кириллица', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorageLS.has('Кириллица'));
  test.isFalse(ClientStorageLS.has('ДругойКлюч'));
  test.equal(ClientStorageLS.get('Кириллица'), testVal);
  ClientStorageLS.empty();
});

Tinytest.add('ClientStorage - LocalStorage - set() / get() / has() - Unicode', function (test) {
  ClientStorageLS.empty();
  var testVal = '⦶';
  var setRes = ClientStorageLS.set('⦁', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorageLS.has('⦁'));
  test.isFalse(ClientStorageLS.has('⦁⦁⦁'));
  test.equal(ClientStorageLS.get('⦁'), testVal);
  ClientStorageLS.empty();
});

Tinytest.add('ClientStorage - LocalStorage - set() / get() / has() -  FALSE', function (test) {
  var testVal = false;
  var setRes = ClientStorageLS.set('testFalse', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorageLS.has('testFalse'));
  test.equal(ClientStorageLS.get('testFalse'), testVal);
});

Tinytest.add('ClientStorage - LocalStorage - set() / get() / has() - TRUE', function (test) {
  var testVal = true;
  var setRes = ClientStorageLS.set('testTrue', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorageLS.has('testTrue'));
  test.equal(ClientStorageLS.get('testTrue'), testVal);
});

Tinytest.add('ClientStorage - LocalStorage - set() / get() / has() - NULL', function (test) {
  var testVal = null;
  var setRes = ClientStorageLS.set('testNull', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorageLS.has('testNull'));
  test.equal(ClientStorageLS.get('testNull'), testVal);
});

Tinytest.add('ClientStorage - LocalStorage - set() / get() - Object and Array', function (test) {
  ClientStorageLS.empty();
  var one = [1, 'one'];
  var two = {two: 2};
  var three = [{three: ['one', 'two', {'three': 3}]}];
  var setResOne = ClientStorageLS.set('teststorageOne', one);
  var setResTwo = ClientStorageLS.set('teststorageTwo', two);
  var setResThree = ClientStorageLS.set('teststorageThree', three);

  test.isTrue(setResOne);
  test.isTrue(setResTwo);
  test.isTrue(setResThree);
  
  test.equal(ClientStorageLS.get('teststorageOne'), one);
  test.equal(ClientStorageLS.get('teststorageTwo'), two);
  test.equal(ClientStorageLS.get('teststorageThree'), three);

  ClientStorageLS.empty();
});

Tinytest.add('ClientStorage - LocalStorage - get() - non existent value', function (test) {
  ClientStorageLS.empty();
  test.isUndefined(ClientStorageLS.get('non-existent-key'));
  ClientStorageLS.empty();
});

Tinytest.add('ClientStorage - LocalStorage - remove() - non existent value', function (test) {
  ClientStorageLS.empty();
  var removeRes = ClientStorageLS.remove('1234567890asdfghjk');
  test.isFalse(removeRes);
  ClientStorageLS.empty();
});

Tinytest.add('ClientStorage - LocalStorage - empty() - ALL', function (test) {
  ClientStorageLS.empty();
  var setResOne = ClientStorageLS.set('teststorageOne', 'One');
  var setResTwo = ClientStorageLS.set('teststorageTwo', 'Two');
  var removeRes = ClientStorageLS.empty();

  test.isTrue(removeRes);
  test.equal(ClientStorageLS.keys(), []);

  removeRes = ClientStorageLS.empty();
  test.isFalse(removeRes);
});

Tinytest.add('ClientStorage - LocalStorage - keys() / has() / remove() - String', function (test) {
  ClientStorageLS.empty();
  var setResOne = ClientStorageLS.set('teststorageOne', 'One');
  var setResTwo = ClientStorageLS.set('teststorageTwo', 'Two');

  test.isTrue(!!~ClientStorageLS.keys().indexOf('teststorageOne'));
  test.isTrue(!!~ClientStorageLS.keys().indexOf('teststorageTwo'));

  test.isTrue(ClientStorageLS.has('teststorageOne'));
  test.isTrue(ClientStorageLS.has('teststorageTwo'));

  var removeRes = ClientStorageLS.remove('teststorageOne');
  test.isTrue(removeRes);

  test.isFalse(ClientStorageLS.has('teststorageOne'));
  test.isTrue(ClientStorageLS.has('teststorageTwo'));
  ClientStorageLS.empty();
});

//////////////
// JS only
//////////////
var ClientStorageJS = new clientStorage('js');
Tinytest.add('ClientStorage - JS - set() / get() / has() - Void', function (test) {
  ClientStorageJS.empty();
  var testVal = void 0;
  var setRes = ClientStorageJS.set('Void', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorageJS.has('Void'));
  test.isUndefined(ClientStorageJS.get('Void'));
  ClientStorageJS.empty();
});

Tinytest.add('ClientStorage - JS - set() / get() - String', function (test) {
  ClientStorageJS.empty();
  var testVal = 'this is test value';
  var setRes = ClientStorageJS.set('teststorage', testVal);
  test.isTrue(setRes);
  test.equal(ClientStorageJS.get('teststorage'), testVal);
  ClientStorageJS.empty();
});

Tinytest.add('ClientStorage - JS - set() / get() / has() -  FALSE', function (test) {
  var testVal = false;
  var setRes = ClientStorageJS.set('testFalse', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorageJS.has('testFalse'));
  test.equal(ClientStorageJS.get('testFalse'), testVal);
});

Tinytest.add('ClientStorage - JS - set() / get() / has() - TRUE', function (test) {
  var testVal = true;
  var setRes = ClientStorageJS.set('testTrue', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorageJS.has('testTrue'));
  test.equal(ClientStorageJS.get('testTrue'), testVal);
});

Tinytest.add('ClientStorage - JS - set() / get() / has() - NULL', function (test) {
  var testVal = null;
  var setRes = ClientStorageJS.set('testNull', testVal);
  test.isTrue(setRes);
  test.isTrue(ClientStorageJS.has('testNull'));
  test.equal(ClientStorageJS.get('testNull'), testVal);
});

Tinytest.add('ClientStorage - JS - set() / get() - Object and Array', function (test) {
  ClientStorageJS.empty();
  var one = [1, 'one'];
  var two = {two: 2};
  var three = [{three: ['one', 'two', {'three': 3}]}];
  var setResOne = ClientStorageJS.set('teststorageOne', one);
  var setResTwo = ClientStorageJS.set('teststorageTwo', two);
  var setResThree = ClientStorageJS.set('teststorageThree', three);

  test.isTrue(setResOne);
  test.isTrue(setResTwo);
  test.isTrue(setResThree);
  
  test.equal(ClientStorageJS.get('teststorageOne'), one);
  test.equal(ClientStorageJS.get('teststorageTwo'), two);
  test.equal(ClientStorageJS.get('teststorageThree'), three);

  ClientStorageJS.empty();
});


Tinytest.add('ClientStorage - JS - get() - non existent value', function (test) {
  ClientStorageJS.empty();
  test.isUndefined(ClientStorageJS.get('non-existent-key'));
  ClientStorageJS.empty();
});

Tinytest.add('ClientStorage - JS - remove() - non existent value', function (test) {
  ClientStorageJS.empty();
  var removeRes = ClientStorageJS.remove('1234567890asdfghjk');
  test.isFalse(removeRes);
  ClientStorageJS.empty();
});

Tinytest.add('ClientStorage - JS - empty() - ALL', function (test) {
  ClientStorageJS.empty();
  var setResOne = ClientStorageJS.set('teststorageOne', 'One');
  var setResTwo = ClientStorageJS.set('teststorageTwo', 'Two');
  var removeRes = ClientStorageJS.empty();

  test.isTrue(removeRes);
  test.equal(ClientStorageJS.keys(), []);

  removeRes = ClientStorageJS.empty();
  test.isFalse(removeRes);
});

Tinytest.add('ClientStorage - JS - keys() / has() / remove() - String', function (test) {
  ClientStorageJS.empty();
  var setResOne = ClientStorageJS.set('teststorageOne', 'One');
  var setResTwo = ClientStorageJS.set('teststorageTwo', 'Two');

  test.isTrue(!!~ClientStorageJS.keys().indexOf('teststorageOne'));
  test.isTrue(!!~ClientStorageJS.keys().indexOf('teststorageTwo'));

  test.isTrue(ClientStorageJS.has('teststorageOne'));
  test.isTrue(ClientStorageJS.has('teststorageTwo'));

  var removeRes = ClientStorageJS.remove('teststorageOne');
  test.isTrue(removeRes);

  test.isFalse(ClientStorageJS.has('teststorageOne'));
  test.isTrue(ClientStorageJS.has('teststorageTwo'));
  ClientStorageJS.empty();
});