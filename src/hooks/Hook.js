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
    const task = this.tasks.pop();
    task.execute(...args);
    this.callback(...args);
  }
}

module.exports = Hook;
