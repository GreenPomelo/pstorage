export default class Storage {
  _nativeMethods = {};

  _runTimeCaches = {};

  _keys = [];

  constructor(props) {
    const { target, keys, adapters = {} } = props;
    if (!(target && typeof target === 'object')) {
      throw new Error('Storage target is invaild!');
    } else {
      // Init storage methods
      const allMethods = [
        'getItem',
        'getItemSync',
        'setItem',
        'setItemSync',
        'removeItem',
        'removeItemSync',
        'clear',
        'clearItem',
        'getInfo',
        'getInfoSync'
      ];
      if (
        (typeof wx !== 'undefined' && target === wx) ||
        (typeof my !== 'undefined' && target === my) ||
        (typeof qq !== 'undefined' && target === qq) ||
        (typeof tt !== 'undefined' && target === tt)
      ) {
        allMethods.map(methodName => {
          const adapterMethod = getAdapterMethod(adapters[methodName], target);
          if (adapterMethod) {
            this._nativeMethods[methodName] = adapterMethod;
          } else {
            switch (methodName) {
              case 'getItem':
                this._nativeMethods[methodName] = target.getStorage.bind(
                  target
                );
                break;
              case 'getItemSync':
                this._nativeMethods[methodName] = target.getStorageSync.bind(
                  target
                );
                break;
              case 'setItem':
                this._nativeMethods[methodName] = target.setStorage.bind(
                  target
                );
                break;
              case 'setItemSync':
                this._nativeMethods[methodName] = target.setStorageSync.bind(
                  target
                );
                break;
              case 'removeItem':
                this._nativeMethods[methodName] = target.removeStorage.bind(
                  target
                );
                break;
              case 'removeItemSync':
                this._nativeMethods[methodName] = target.removeStorageSync.bind(
                  target
                );
                break;
              case 'clear':
                this._nativeMethods[methodName] = target.clearStorage.bind(
                  target
                );
                break;
              case 'clearSync':
                this._nativeMethods[methodName] = target.clearStorageSync.bind(
                  target
                );
                break;
              case 'getInfo':
                this._nativeMethods[methodName] = target.getStorageInfo.bind(
                  target
                );
                break;
              case 'getInfoSync':
                this._nativeMethods[
                  methodName
                ] = target.getStorageInfoSync.bind(target);
                break;
              default:
                break;
            }
          }
        });
      } else {
        // w3c standard storage
        const methodsName = ['getItem', 'setItem', 'removeItem', 'clear'];
        methodsName.map(methodName => {
          this._nativeMethods[methodName + 'Sync'] =
            getAdapterMethod(adapters[methodName + 'Sync'], target) ||
            target[methodName].bind(target);
          this._nativeMethods[methodName] =
            getAdapterMethod(adapters[methodName], target) ||
            function(...args) {
              if (methodName === 'setItem') {
                const [key, data, callback, fallback] = args;
                try {
                  this._nativeMethods.setItem(key, data);
                  callback();
                } catch (err) {
                  fallback(err);
                }
              } else if (methodName === 'clear') {
                const [callback, fallback] = args;
                try {
                  this._nativeMethods.clear();
                  callback();
                } catch (err) {
                  fallback(err);
                }
              } else {
                const [key, callback, fallback] = args;
                try {
                  const value = this._nativeMethods[methodName](key);
                  value ? callback(value) : callback();
                } catch (err) {
                  fallback(err);
                }
              }
            };
        });
        Object.keys(target).map(key => {
          if (!allMethods.includes(key) && !this[key] && !keys.includes(key)) {
            this[key] = target[key];
          }
        });
        if (target.constructor.name !== 'Object') {
          Object.keys(target.__proto__).map(key => {
            if (
              !allMethods.includes(key) &&
              !this[key] &&
              !keys.includes(key)
            ) {
              this.__proto__[key] = target[key];
            }
          });
        }
      }
      // Init storage value
      if (!keys || !Array.isArray(keys)) {
        throw new Error('Keys must be an array');
      } else {
        keys.map(key => {
          try {
            // Todo: use async method
            const value = this._nativeMethods.getItemSync(key);
            this._keys.push(key);
            if (!value) {
              this._runTimeCaches[key] = JSON.parse(value);
            }
          } catch (err) {
            this._runTimeCaches[key] = {
              value: null
            };
          }
        });
      }
    }
  }
  getItem(key) {
    return new Promise((resolve, reject) => {
      if (this._runTimeCaches[key]) {
        resolve(this._runTimeCaches[key].value);
      } else {
        reject("The key isn't regisitered in keys!");
      }
    });
  }
  getItemSync(key) {
    if (this._runTimeCaches[key]) {
      return this._runTimeCaches[key].value;
    } else {
      throw new Error("The key isn't regisitered in keys!");
    }
  }
  setItem(key, value) {
    return new Promise((resolve, reject) => {
      if (this._keys.includes(key)) {
        const storageValue = {
          value
        };
        const stringifyValue = JSON.stringify(storageValue);
        const preFunc = () => {
          this._runTimeCaches[key] = {
            ...storageValue,
            stringifyValue
          };
        };
        this._nativeMethods.setItem(
          key,
          stringifyValue,
          customResolve(preFunc, resolve),
          reject
        );
      } else {
        reject('You need register the key first!');
      }
    });
  }
  setItemSync(key, value) {
    if (this._keys.includes(key)) {
      const storageValue = {
        value
      };
      const stringifyValue = JSON.stringify(storageValue);
      this._nativeMethods.setItemSync(key, stringifyValue);
      this._runTimeCaches[key] = {
        ...storageValue,
        stringifyValue
      };
    } else {
      throw new Error('You need register the key first!');
    }
  }
  removeItem(key) {
    return new Promise((resolve, reject) => {
      const preFunc = () => {
        if (typeof this._runTimeCaches[key] === 'object') {
          this._runTimeCaches[key].value = null;
          this._runTimeCaches[key].stringifyValue = null;
        }
      };
      this._nativeMethods.removeItem(
        key,
        customResolve(preFunc, resolve),
        reject
      );
    });
  }
  removeItemSync(key) {
    this._nativeMethods.removeItemSync(key);
    if (typeof this._runTimeCaches[key] === 'object') {
      this._runTimeCaches[key].value = null;
      this._runTimeCaches[key].stringifyValue = null;
    }
  }
  clear() {
    return new Promise((resolve, reject) => {
      const preFunc = () => {
        Object.values(this._runTimeCaches).map(storageValue => {
          if (typeof storageValue === 'object') {
            storageValue.value = null;
            storageValue.stringifyValue = null;
          }
        });
      };
      this._nativeMethods.clear(customResolve(preFunc, resolve), reject);
    });
  }
  clearSync() {
    this._nativeMethods.clearSync();
    Object.values(this._runTimeCaches).map(storageValue => {
      if (typeof storageValue === 'object') {
        storageValue.value = null;
        storageValue.stringifyValue = null;
      }
    });
  }
  getInfo() {
    return new Promise((resolve, reject) => {
      if (this._nativeMethods.getInfo) {
        this._nativeMethods.getInfo(resolve, reject);
      } else {
        resolve({
          keys: this._keys,
          currentSize: getCurrentSize(this._runTimeCaches),
          limitSize: null
        });
      }
    });
  }
  getInfoSync() {
    if (this._nativeMethods.getInfo) {
      return this._nativeMethods.getInfoSync();
    } else {
      return {
        keys: this._keys,
        currentSize: getCurrentSize(this._runTimeCaches),
        limitSize: null
      };
    }
  }
}

function customResolve(preFunc, resolve) {
  return function() {
    preFunc();
    resolve();
  };
}

function getCurrentSize(storage) {
  return Number(
    (
      Object.values(storage).reduce(
        (prevLength, nextValue) => prevLength + nextValue.stringifyValue.length,
        0
      ) / 1024
    ).toFixed(2)
  );
}

function getAdapterMethod(func, target) {
  return func ? func.bind(target) : undefined;
}
