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

  callAsync(...args) {
    this.callback = args.pop();
    const params = args;

    this._callAsync(...params);
    this.callback();
  }

  _callAsync(...args) {
    this.tasks.forEach((task) => {
      task.execute(...args);
    });
  }
}

const a = new AsyncParallelHook();
console.time('cost');
a.tap('plugin1', () => {
  console.log(1);
});
a.tapAsync('plugin2', () => {
  setTimeout(() => {
    console.log(2);
    console.timeEnd('cost');
  }, 200);
});
a.tapAsync('plugin3', () => {
  setTimeout(() => {
    console.log(3);
  }, 100);
});
a.tapPromise(
  'plugin4',
  () => new Promise((resolve) => {
    resolve();
  }).then(() => {
    console.log(4);
  }),
);
a.callAsync(() => {
  console.log('end');
});

module.exports = AsyncParallelHook;
