const { runLoaders } = require('./loader-runner')
const path = require('path')
const fs = require('fs')
const Parser = require('./parser')

class Module {
    constructor(dep) {
        this.resource = dep.resource
        this.rawRequest = dep.rawRequest
        this.source = undefined
        this.context = dep.context
        this.id = undefined
        this.dependencies = new Set()
        this._ast = undefined
    }

    build(config) {
        const { rules } = config
        for(const item of rules) {
            const result = item.test.test(this.resource)
            if(result) {
                const loaders = item.loaders
                const source = fs.readFileSync(this.resource)
                const sourceString = source.toString()
                this.id = this.resource.replace(process.cwd(), '')
                this.source = runLoaders(sourceString, loaders)
                this.getDependencies()
            }
        }
        
    }
    // 依赖收集
    getDependencies() {
        const parser = new Parser()
        this._ast = parser.parse(this.source)
        this.dependencies = parser.getDependencies(this._ast, this.context)
        console.log('[mypack info]: get dependencies', this.dependencies)
    }
}

module.exports = Module