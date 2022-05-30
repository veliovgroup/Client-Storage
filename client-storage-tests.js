import { ClientStorage } from './client-storage.js';

var storages = {
  auto: new ClientStorage(),
  cookies: new ClientStorage('cookies'),
  localStorage: new ClientStorage('localStorage'),
  js: new ClientStorage('js')
};

for (var storageName of Object.keys(storages)) {
  var storage = storages[storageName];

  Tinytest.add(`[${storageName}] storage - set() / get() / has() - Void (Should fail for localStorage)`, function (test) {
    storage.empty();
    var testVal = void 0;
    var setRes = storage.set('Void', testVal);
    test.isTrue(setRes);
    test.isTrue(storage.has('Void'));
    test.isUndefined(storage.get('Void'));
    storage.empty();
  });

  Tinytest.add(`[${storageName}] storage - set() / get() - String`, function (test) {
    storage.empty();
    var testVal = 'this is test value';
    var setRes = storage.set('teststorage', testVal);
    test.isTrue(setRes);
    test.equal(storage.get('teststorage'), testVal);
    storage.empty();
  });

  Tinytest.add(`[${storageName}] storage - set() / get() / has() - Cyrillic`, function (test) {
    storage.empty();
    var testVal = 'Ключ и значение';
    var setRes = storage.set('Кириллица', testVal);
    test.isTrue(setRes);
    test.isTrue(storage.has('Кириллица'));
    test.isFalse(storage.has('ДругойКлюч'));
    test.equal(storage.get('Кириллица'), testVal);
    storage.empty();
  });

  Tinytest.add(`[${storageName}] storage - set() / get() / has() - Unicode`, function (test) {
    storage.empty();
    var testVal = '⦶';
    var setRes = storage.set('⦁', testVal);
    test.isTrue(setRes);
    test.isTrue(storage.has('⦁'));
    test.isFalse(storage.has('⦁⦁⦁'));
    test.equal(storage.get('⦁'), testVal);
    storage.empty();
  });

  Tinytest.add(`[${storageName}] storage - set() / get() - Object and Array`, function (test) {
    storage.empty();
    var one = [1, 'one'];
    var two = {two: 2};
    var three = [{three: ['one', 'two', {'three': 3}]}];
    var setResOne = storage.set('teststorageOne', one);
    var setResTwo = storage.set('teststorageTwo', two);
    var setResThree = storage.set('teststorageThree', three);

    test.isTrue(setResOne);
    test.isTrue(setResTwo);
    test.isTrue(setResThree);

    test.equal(storage.get('teststorageOne'), one);
    test.equal(storage.get('teststorageTwo'), two);
    test.equal(storage.get('teststorageThree'), three);

    storage.empty();
  });

  Tinytest.add(`[${storageName}] storage - set() / get() / has() - FALSE`, function (test) {
    var testVal = false;
    var setRes = storage.set('testFalse', testVal);
    test.isTrue(setRes);
    test.isTrue(storage.has('testFalse'));
    test.equal(storage.get('testFalse'), testVal);
  });

  Tinytest.add(`[${storageName}] storage - set() / get() / has() - TRUE`, function (test) {
    var testVal = true;
    var setRes = storage.set('testTrue', testVal);
    test.isTrue(setRes);
    test.isTrue(storage.has('testTrue'));
    test.equal(storage.get('testTrue'), testVal);
  });

  Tinytest.add(`[${storageName}] storage - set() / get() / has() - NULL`, function (test) {
    var testVal = null;
    var setRes = storage.set('testNull', testVal);
    test.isTrue(setRes);
    test.isTrue(storage.has('testNull'));
    test.equal(storage.get('testNull'), testVal);
  });

  Tinytest.add(`[${storageName}] storage - get() - non existent value`, function (test) {
    storage.empty();
    test.isUndefined(storage.get('non-existent-key'));
    storage.empty();
  });

  Tinytest.add(`[${storageName}] storage - remove() - non existent value`, function (test) {
    storage.empty();
    var removeRes = storage.remove('1234567890asdfghjk');
    test.isFalse(removeRes);
    storage.empty();
  });

  Tinytest.add(`[${storageName}] storage - empty() - ALL`, function (test) {
    storage.empty();
    storage.set('teststorageOne', 'One');
    storage.set('teststorageTwo', 'Two');
    var removeRes = storage.empty();

    test.isTrue(removeRes);
    test.equal(storage.keys(), []);

    removeRes = storage.empty();
    test.isFalse(removeRes);
  });

  Tinytest.add(`[${storageName}] storage - keys() / has() / remove() - String`, function (test) {
    storage.empty();
    storage.set('teststorageOne', 'One');
    storage.set('teststorageTwo', 'Two');

    test.isTrue(!!~storage.keys().indexOf('teststorageOne'));
    test.isTrue(!!~storage.keys().indexOf('teststorageTwo'));

    test.isTrue(storage.has('teststorageOne'));
    test.isTrue(storage.has('teststorageTwo'));

    var removeRes = storage.remove('teststorageOne');
    test.isTrue(removeRes);

    test.isFalse(storage.has('teststorageOne'));
    test.isTrue(storage.has('teststorageTwo'));
    storage.empty();
  });

  Tinytest.addAsync(`[${storageName}] storage - set() / get() - 2s TTL (Max-Age; ExpireAt;)`, function (test, next) {
    storage.empty();
    var testVal = 'this is test value with 2s TTL';
    var setRes = storage.set('teststorage', testVal, 2);
    test.isTrue(setRes);
    test.equal(storage.get('teststorage'), testVal);
    setTimeout(function () {
      test.equal(storage.get('teststorage'), testVal, 'record exists after 1 seconds');
    }, 1000);

    setTimeout(function () {
      test.equal(storage.get('teststorage'), void 0, 'record is gone after 3 seconds');
      storage.empty();
      next();
    }, 3000);
  });
}
