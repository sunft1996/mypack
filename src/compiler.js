const path = require('path');
const process = require('process');
const fs = require('fs');
const Factory = require('./factory');
const Dependency = require('./dependency');
const SyncHook = require('./hooks/SyncHook');

class Compiler {
  constructor() {
    this.config = {};
    this.entry = undefined;
    this.dependencies = new Set();
    this.entryModule = undefined;
    this.modules = new Set();
    this.asset = undefined;
    this.context = process.cwd();
    this.hooks = {
      beforeRun: new SyncHook(),
      beforeCompiler: new SyncHook(),
      renderManifest: new SyncHook(),
    };
  }

  run() {
    this.hooks.beforeRun.call(this);
    try {
      // todo: valid config
      this.config = require(path.join(process.cwd(), './mypack.config.js'));
    } catch (error) {
      console.error('[mypack error]: mypack.config.js is not exit!');
      return;
    }
    console.log('[mypack info]: the final config is', JSON.stringify(this.config));
    this.compile();
  }

  compile() {
    this.hooks.beforeCompiler.call(this);
    const entryResource = path.resolve(this.context, this.config.entry);
    const entry = new Dependency({
      rawRequest: this.config.entry,
      resource: entryResource,
      context: path.dirname(entryResource),
    });
    this.entry = entry;
    this.buildModule(this.entry);
    this.hooks.renderManifest.call(this);
    fs.writeFileSync(path.resolve(process.cwd(), this.config.output, 'output.js'), this.asset);
  }

  buildModule(dependency) {
    this.dependencies.add(dependency);
    const factory = new Factory(this.config);
    const module = factory.create(dependency);
    module.build(this.config);
    this.modules.add(module);
    if (module.dependencies.size > 0) {
      for (const dep of module.dependencies) {
        this.buildModule(dep);
      }
    } else {

    }
  }
}

module.exports = Compiler;
