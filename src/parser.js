const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse').default
const Path = require('path')
const fs = require('fs')
const Dependency = require('./dependency')
const { isFileExist } = require('./utils/util')
class Parser {
    parse(source) {
        const result = parse(source)
        return result
    }

    getDependencies(ast, context) {
        const dependencies = new Set()

        traverse(ast, {
            enter(path) {
                if (path.isIdentifier({ name: 'require' })) {
                    const parent = path.parent
                    let rawRequest = parent.arguments[0].value
                    let resource
                    let options
                    if(/\.js$/.test(rawRequest)) {
                        resource = Path.resolve(context, rawRequest)
                        isFileExist(resource, () => { 
                            const context = Path.dirname(resource)
                            options = {
                                rawRequest,
                                resource,
                                context
                            }
                        })
                    } else {
                        resource = Path.resolve(context, rawRequest + '.js')
                        const findIndex = () => {
                            const absolutePath = Path.resolve(context, rawRequest, './index.js')
                            isFileExist(absolutePath, () => {
                                const context = Path.dirname(resource)
                                options = {
                                    rawRequest,
                                    resource: absolutePath,
                                    context
                                }
                            })
                        }
                        isFileExist(resource, () => { 
                            const context = Path.dirname(resource)
                            options = {
                                rawRequest,
                                resource,
                                context
                            }
                        }, findIndex)
                    }

                    const dependency = new Dependency(options)
                    dependencies.add(dependency)

                }
            }
        })
        return dependencies
    }
}

module.exports = Parser