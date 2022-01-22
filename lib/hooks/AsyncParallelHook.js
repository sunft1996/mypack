/*
 * 异步并行勾子
 */
const Hook = require('./Hook');

class AsyncParallelHook extends Hook {
  call() {
    throw new Error('AsyncParallelHook is not support to call, use tapAsync');
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

  /**
   * @param {array} args 最后一个参数为回调函数，在所有绑定的方法执行完成后执行
   */
  callAsync(...args) {
    this._callAsync(...args);
  }

  _callAsync(...args) {
    let times = 0;
    const finalCallback = args.pop();
    const callback = (val) => {
      // 立即执行 finalCallback
      if (val) {
        times = this.tasks.length - 1;
      }
      if (times < this.tasks.length - 1) {
        times++;
      } else {
        finalCallback();
      }
    };
    this.tasks.forEach((task) => {
      task.execute(...args, callback);
    });
  }
}

const a = new AsyncParallelHook();
console.time('cost');

a.tapAsync('plugin1', (name, callback) => {
  setTimeout(() => {
    console.log(1);
    callback();
  }, 3000);
});
a.tapAsync('plugin2', (name, callback) => {
  setTimeout(() => {
    console.log(2);
    callback(1);
  }, 2000);
});
a.tapAsync('plugin3', (name, callback) => {
  setTimeout(() => {
    callback();
    console.log(3);
  }, 1000);
});
// a.tapPromise(
//   'plugin4',
//   () => new Promise((resolve) => {
//     resolve();
//   }).then(() => {
//     console.log(4);
//   }),
// );
a.callAsync('xiaoming', () => {
  console.timeEnd('cost');
});

module.exports = AsyncParallelHook;
