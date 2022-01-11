class JsModuleTemplate {
  constructor(modules, config) {
    this.modules = modules;
    this.config = config;
  }

  render() {
    const template = `(() => {
            // 当前chunk包含的所有模块
            var __webpack_modules__={[import___webpack___modules___here]}
              // webpack模块化方案中用于加载模块的方法
            function require(moduleId) {
              var module = {
                exports: {}
              }
              // 根据moduleId找到__webpack_modules__对应的方法，传入module对象，执行；
              // 由于模块中变量的定义都是在这里定义的，不是全局变量，因此不会发生变量冲突，解决了作用域的问题
              __webpack_modules__[moduleId](module)
              return module.exports
            }
          
            // 加载入口模块，执行起点
            var __webpack_exports__ = require("[entry___webpack___modules___here]");
          })()`;
    let __webpack_modules__string = '';
    this.modules.forEach((m) => {
      __webpack_modules__string += `"${m.id}":(module) => {
                eval(\`${m.source}\`)
            },\n`;
    });
    const __entry_modules__string = this.config.entry;
    let asset;
    asset = template.replace('[import___webpack___modules___here]', __webpack_modules__string);
    asset = asset.replace('[entry___webpack___modules___here]', __entry_modules__string);

    return asset;
  }
}

module.exports = JsModuleTemplate;
