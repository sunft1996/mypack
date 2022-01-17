/*
 * 异步串行勾子
 */
const Hook = require('./Hook');

class AsyncSeriesHook extends Hook {
  call() {
    throw new Error('AsyncSeriesHook is not support to call, use tapAsync');
  }

  tapAsync(name, fn) {
    this.tasks.push({
      type: 'async',
      name,
      execute: fn,
    });
  }

  tapPromise(name, fn) {
    this.tasks.push({
      type: 'promise',
      name,
      execute: fn,
    });
  }

  callAsync(...args) {
    this.callback = args.pop();
    const params = args;

    this._callAsync(...params);
  }

  _callAsync(...args) {
    const task = this.tasks.shift();
    if (!task) {
      this.callback();
      return;
    }
    switch (task.type) {
      case 'sync':
        task.execute(...args);
        this._callAsync(...args);
        break;
      case 'async':
        task.execute(...args, this._callAsync);
        break;
      case 'promise':
        task.execute(...args)
          .then(() => {
            this._callAsync(...args);
          })
          .catch((err) => {
            throw err;
          });
        break;
      default:
        task.execute(...args);
        break;
    }
  }
}
module.exports = AsyncSeriesHook;

const a = new AsyncSeriesHook();

a.tapAsync('plugin1', (name, callback) => {
  setTimeout(() => {
    console.log(1);
    callback.call(a, name);
  }, 1000);
});
a.tapAsync('plugin2', (name, callback) => {
  setTimeout(() => {
    console.log(2);
    callback.call(a, name);
  }, 500);
});
a.tapPromise('plugin3', (name) => new Promise((resolve, reject) => {
  if (name === 'sunfutao') {
    console.log(3);
    resolve();
  } else {
    reject();
  }
}));
a.tapPromise('plugin4', (name) => new Promise((resolve, reject) => {
  if (name === 'sunfutao') {
    console.log(4);
    resolve();
  } else {
    const error = new Error('name not right');
    reject(error);
  }
}));
a.callAsync('sunfutao', () => { console.log('end'); });
