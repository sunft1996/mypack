const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');
const pathModule = require('path');
const Dependency = require('./dependency');
const { isFileExist } = require('./utils/util');

class Parser {
  parse(source) {
    const result = parse(source);
    return result;
  }

  getDependencies(ast, context) {
    const dependencies = new Set();
    const replacements = new Set();

    const results = this._getDependencies(ast, context);
    results.forEach((i) => {
      const dep = {
        rawRequest: i.rawRequest,
        resource: i.resource,
        context: i.context,
      };
      const replacement = {
        content: i.content,
        start: i.start,
        end: i.end,
      };
      const dependency = new Dependency(dep);
      dependencies.add(dependency);
      replacements.add(replacement);
    });

    return {
      dependencies,
      replacements,
    };
  }

  _getDependencies(ast, context) {
    const results = [];
    traverse(ast, {
      enter(path) {
        if (path.isIdentifier({ name: 'require' })) {
          const { parent } = path;
          const requestValueNode = parent.arguments[0];
          const rawRequest = requestValueNode.value;
          let resource;
          let result;
          if (/\.js$/.test(rawRequest)) {
            resource = pathModule.resolve(context, rawRequest);
            isFileExist(resource, () => {
              result = {
                rawRequest,
                resource,
                context: pathModule.dirname(resource),
                content: `"${pathModule.relative(process.cwd(), resource)}"`,
                start: requestValueNode.start,
                end: requestValueNode.end,
              };
            });
          } else {
            resource = pathModule.resolve(context, `${rawRequest}.js`);
            const findIndex = () => {
              const absolutePath = pathModule.resolve(context, rawRequest, './index.js');
              isFileExist(absolutePath, () => {
                result = {
                  rawRequest,
                  resource: absolutePath,
                  context: pathModule.dirname(absolutePath),
                  content: `"${pathModule.relative(process.cwd(), absolutePath)}"`,
                  start: requestValueNode.start,
                  end: requestValueNode.end,
                };
              });
            };
            isFileExist(resource, () => {
              result = {
                rawRequest,
                resource,
                context: pathModule.dirname(resource),
                content: `"${pathModule.relative(process.cwd(), resource)}"`,
                start: requestValueNode.start,
                end: requestValueNode.end,
              };
            }, findIndex);
          }
          results.push(result);
        }
      },
    });
    return results;
  }
}

module.exports = Parser;
