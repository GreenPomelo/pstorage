## pstorage
[English](./README.md) | 简体中文

### pstorage 是什么 ?

这是一个通用的缓存管理方案. 可以适配多种缓存器, 并且能够合理的管理需要存储的数据.

### pstorage 的特点
- 支持多端缓存器适配
- 统一的存储数据管理
- 运行时缓存，减小对 Storage 的读取压力
- 掌握被存储数据的信息
- 同时支持同步、异步写法
- 兼容缓存器其他没有使用到的 api

### 使用方法

#### 在使用之前，我们需要在入口文件注册 `storage`，并且将其设置为一个全局变量:

```javascript
const Storage = require('pstorage');
const storage = new Storage({
  target: localStorage,
  keys: ['userInfo']
});
// 设置为全局变量
// 浏览器
window.storage = storage
// 微信小程序的 app.js
App({
  ...
  storage,
});

```

#### 存储初始 storage item:

```javascript
const storage = window.storage;
const userInfo = {
	name: 'Jack'
};
/**
 * 用户信息在运行时的存储格式为：
 * {
 *   key: 'userInfo',
 *   value: {
 *     name: 'Jack'
 *   },
 *   type: 'Object'
 * }
 * 持久性缓存的格式为：
 * "{"key":"userInfo","value":{"name":"Jack"},"type":"Object"}"
 */
// 同步存储, 返回是否存储成功
const [result, err] = storage.setItemSync('userInfo', userInfo);
// 异步存储，返回一个 promise
storage.setItem('userInfo', userInfo).then(result => {}).catch(err => {});
```

#### 获取 storage item:

```javascript
const storage = window.storage;
// 同步方法
const userInfo = storage.getItemSync('userInfo');
// 异步方法
storage.getItem('userInfo').then(userInfo => {});
```

#### 移除 storage item:

```javascript
const storage = window.storage;
// 同步方法
const result = storage.removeSync('userInfo');
// 异步方法
storage.remove('userInfo').then(result => {});
```

#### 清除所有存储的数据

```javascript
const storage = window.storage;
// 同步方法
const result = storage.clearSync('userInfo');
// 异步方法
storage.clear('userInfo').then(result => {});
```

#### 获取当前的缓存信息

```javascript
const storage = window.storage;
// 同步方法
const result = storage.getInfoSync('userInfo');
// 异步方法
storage.getInfo().then(result => {});
```
#### 使用 storage 适配器
storage 适配器是用来选择性重写缓存器的原生方法，具体使用方法如下：

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
官方在 Web 容器内已经支持的缓存器有：`localStorage`, `sessionStorage`；
在小程序容器下已经支持：微信小程序、阿里小程序、头条小程序；
在 ReactNative 的容器下支持：`AsyncStorage`

### 兼容缓存器其他没有使用到的 api
以 React-Native 为例，`AsyncStorage` 支持如下写法：

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
