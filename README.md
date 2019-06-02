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
window.storage = storage
// Like weixin miniprogram, in app.js
App({
  ...
  storage,
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
 *   key: 'userInfo',
 *   value: {
 *     name: 'Jack'
 *   },
 *   type: 'Object'
 * }
 * Persistent store is:
 * "{"key":"userInfo","value":{"name":"Jack"},"type":"Object"}"
 */
// Store sync, and return whether it is successful
const [result, err] = storage.setItemSync('userInfo', userInfo);
// Store async, and return a promise
storage.setItem('userInfo', userInfo).then(result => {}).catch(err => {});
```

#### Get storage item:

```javascript
const storage = window.storage;
// Sync method
const userInfo = storage.getItemSync('userInfo');
// Async method
storage.getItem('userInfo').then(userInfo => {});
```

#### Remove storage item:

```javascript
const storage = window.storage;
// Sync method
const result = storage.removeSync('userInfo');
// Async method
storage.remove('userInfo').then(result => {});
```

#### Clear all items

```javascript
const storage = window.storage;
// Sync method
const result = storage.clearSync('userInfo');
// Async method
storage.clear('userInfo').then(result => {});
```
#### Get current storage infomation

```javascript
const storage = window.storage;
// Sync method
const result = storage.getInfoSync('userInfo');
// Async method
storage.getInfo().then(result => {});
```
#### Use storage adapter
Storage adapter's target is override storage's native method, and all configurations are optional.

```javascript
const Storage = require('pstorage');
const storage = new Storage({
  target: localStorage,
  keys: ['userInfo']
});
const getItemAsync = function(getItem) {
  return function(key, callback, fallback, completeback) {
    getItem(key)
    callback();
    complete();
  }
}
const setItemAsync = function(setItem) {
  return function(key, data, callback, fallback, completeback) {
    setItem(key, data)
    callback();
    complete();
  }
}
storage.useAdapter({
  getItem: getItemAsync(localStorage.getItem),
  setItem: setItemAsync(localStorage.setItem),
  getItemSync: localStorage.getItem,
  setItemSync: localStorage.setItem
});
```
The official storage already supported in the web container are: `localStorage`, `sessionStorage`;
Supported in the miniprogram container: weChat miniprogram, ali miniprogram, toutiao miniprogram;
Supported in the React-Native container: `AsyncStorage`

### Compatible with other apis that are not used by the cache
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
