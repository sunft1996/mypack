const Compiler = require('./compiler');
const JavascriptModulesPlugin = require('./plugins/JavascriptModulesPlugin');

const compiler = new Compiler();
const javascriptModulesPlugin = new JavascriptModulesPlugin();
javascriptModulesPlugin.apply(compiler);
compiler.run();
