const path = require('path');
const fs = require('fs');
const { runLoaders } = require('./loader-runner');
const Parser = require('./parser');

class Module {
  constructor(dep) {
    this.resource = dep.resource;
    this.rawRequest = dep.rawRequest;
    this.source = {};
    this.context = dep.context;
    this.id = undefined;
    this.dependencies = new Set();
    this._ast = undefined;
    this.parser = undefined;
  }

  build(config) {
    const { rules } = config;
    for (const item of rules) {
      const result = item.test.test(this.resource);
      if (result) {
        const { loaders } = item;
        const source = fs.readFileSync(this.resource);
        const sourceString = source.toString();
        this.id = path.relative(process.cwd(), this.resource);
        this.source._source = runLoaders(sourceString, loaders);
        this.parser = new Parser();
        // todo 生成对应的replaceMent，最后seal的时候替换
        this.getDependencies();
      }
    }
  }

  // 依赖收集
  getDependencies() {
    this._ast = this.parser.parse(this.source._source);
    const { dependencies, replacements } = this.parser.getDependencies(this._ast, this.context);
    this.dependencies = dependencies;
    this.source.replacements = replacements;
    console.log('[mypack info]: get dependencies', this.dependencies);
  }
}

module.exports = Module;
