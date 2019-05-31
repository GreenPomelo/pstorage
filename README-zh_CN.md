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

### 使用方法

#### 在使用之前，我们需要在入口文件注册 `storage`，并且将其设置为一个全局变量:

```javascript
const Storage = require('pstorage');
const storage = new Storage(localStorage);
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

#### 更新 storage item:

```javascript
const storage = window.storage;
// 同步方法
const [result, err] = storage.updateItemSync('userInfo');
// 异步方法
storage.updateItem('userInfo').then(result => {}).catch(() => {});
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


