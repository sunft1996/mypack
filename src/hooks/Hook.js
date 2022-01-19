class Hook {
  constructor() {
    this.tasks = [];
    this.callback = undefined;
  }

  tap(name, fn) {
    const task = {
      type: 'sync',
      name,
      execute: fn,
    };
    this.tasks.push(task);
  }

  call(...args) {
    this.callback = args.pop();
    while (this.tasks.length > 0) {
      const task = this.tasks.shift();
      task.execute(...args);
    }
  }
}

module.exports = Hook;
