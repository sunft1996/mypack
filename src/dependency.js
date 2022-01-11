class Dependency {
  constructor(options) {
    this.rawRequest = options.rawRequest;
    this.context = options.context;
    this.resource = options.resource;
  }
}

module.exports = Dependency;
