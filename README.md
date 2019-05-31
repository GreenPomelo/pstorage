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
 *   value: "{"name":"Jack"}",
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

#### Update storage item:

```javascript
const storage = window.storage;
// Sync method
const [result, err] = storage.updateItemSync('userInfo');
// Async method
storage.updateItem('userInfo').then(result => {}).catch(() => {});
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


