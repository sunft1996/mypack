const Module = require('./module');

class Factory {
  constructor(config) {
    this.config = config;
  }

  create(dep) {
    const module = new Module(dep, this.config);
    return module;
  }
}

module.exports = Factory;
