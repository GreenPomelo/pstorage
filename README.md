## pstorage

English | [简体中文](./README-zh_CN.md)

### What is pstorage ?

It's a common storage manager. It can adapt to kinds of storage, and manage the stored data reasonably.

### Why we need it ?

- Support multi-end storage adaptation
- Unified storage data management
- Runtime caching to reduce read pressure on Storage
- Master the information of the stored data
- Simultaneous support for synchronous and asynchronous writing
- Compatible with other apis that are not used by the storage

### Usage

#### Before we use it, we should init it in entry file and set as a global variable:

```javascript
const Storage = require('pstorage');
const storage = new Storage({
  target: localStorage,
  keys: ['userInfo']
});
// set it as a global variable
// Like brower
window.storage = storage;
// Like weixin miniprogram, in app.js
App({
  ...storage
});
```

#### Store storage item:

```javascript
const storage = window.storage;
const userInfo = {
  name: 'Jack'
};
/**
 * UserInfo is stored in runtime as:
 * {
 *   value: {
 *     name: 'Jack'
 *   }
 * }
 * Persistent store is:
 * '{"value": "{"name":"Jack"}"}'
 */
// Store sync, return undefined
try {
  storage.setItemSync('userInfo', userInfo);
} catch (err) {
  console.log(err);
}
// Store async, and return a promise
storage
  .setItem('userInfo', userInfo)
  .then(() => {})
  .catch(err => {});
```

#### Get storage item:

```javascript
const storage = window.storage;
// Sync method
try {
  const userInfo = storage.getItemSync('userInfo');
} catch (err) {
  console.log(err);
}
// Async method
storage.getItem('userInfo').then(userInfo => {});
```

#### Remove storage item:

```javascript
const storage = window.storage;
// Sync method
try {
  storage.removeSync('userInfo');
} catch (err) {
  console.log(err);
}
// Async method
storage.remove('userInfo').then(() => {});
```

#### Clear all items

```javascript
const storage = window.storage;
// Sync method
try {
  storage.clearSync('userInfo');
} catch (err) {
  console.log(err);
}
// Async method
storage.clear('userInfo').then(() => {});
```

#### Get current storage information

```javascript
const storage = window.storage;
// Sync method
try {
  const result = storage.getInfoSync();
} catch (err) {
  console.log(err);
}
// Async method
storage.getInfo().then(result => {});
```

| Property    | Type           | Description                                   |
| ----------- | -------------- | --------------------------------------------- |
| keys        | Array.<string> | All keys currently stored                     |
| currentSize | number         | The amount of space currently occupied, in KB |
| limitSize   | number         | Limit space size in KB                        |

**Notice**
Due to differences between containers, only miniprogram app platforms return a valid `limitSize`.

#### Use storage adapter

Storage adapter's target is override storage's native method, and all configurations are optional.

```javascript
const Storage = require('pstorage');

const getItemAsync = function(getItem) {
  return function(key, callback, fallback) {
    try {
      const value = getItem(key);
      callback(value);
    } catch (err) {
      fallback(err);
    }
  };
};
const setItemAsync = function(setItem) {
  return function(key, data, callback, fallback) {
    try {
      setItem(key, data);
      callback();
    } catch (err) {
      fallback(err);
    }
  };
};

const storage = new Storage({
  target: localStorage,
  keys: ['userInfo'],
  adapters: {
    getItem: getItemAsync(localStorage.getItem),
    setItem: setItemAsync(localStorage.setItem),
    getItemSync: localStorage.getItem,
    setItemSync: localStorage.setItem
  }
});
```

The official storage already supported in the web container are: `localStorage`, `sessionStorage`;
Supported in the miniprogram container: weChat miniprogram, ali miniprogram, toutiao miniprogram;
Supported in the React-Native container: `AsyncStorage`

### Compatible with other apis that are not used by the storage

Just like React-Native:

```javascript
import { AsyncStorage } from 'react-native';
import Storage from 'pstorage';

const storage = new Storage({
  target: AsyncStorage,
  keys: ['userInfo']
});

storage.getAllKeys((err, keys) => {
  if (!err) {
    console.log(keys);
  }
});
```
