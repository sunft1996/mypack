const path = require('path')
const process  = require('process')
const Factory = require('./factory')
const JsModuleTemplate = require('./templates/jsModuleTemplate')
const fs = require('fs')
const Dependency = require('./dependency')
class Compiler {
    constructor() {
        this.config = {}
        this.entry = undefined
        this.dependencies = new Set()
        this.entryModule = undefined
        this.modules = new Set()
        this.asset = undefined
        this.context = process.cwd()
    }

    run () {
        try {
            // todo: valid config
            this.config = require(path.join(process.cwd(), './mypack.config.js'))
        } catch (error) {
            console.error('[mypack error]: mypack.config.js is not exit!')
            return
        }
        console.log('[mypack info]: the final config is', JSON.stringify(this.config))
        this.compile()
    }

    compile() {
        const entryResource = path.resolve(this.context, this.config.entry)
        const entry = new Dependency({
            rawRequest: this.config.entry,
            resource: entryResource,
            context: path.dirname(entryResource)
        })
        this.entry = entry
        this.buildModule(this.entry)
        // 填入模版
        console.log(this.modules)
        const jsModuleTemplate = new JsModuleTemplate(this.modules, this.config)
        const asset = jsModuleTemplate.render()
        this.asset = asset
        fs.writeFileSync(path.resolve(process.cwd(), this.config.output, 'output.js'), asset)
    }

    buildModule(dependency) {
        this.dependencies.add(dependency)
        const factory = new Factory(this.config)
        const module = factory.create(dependency)
        module.build(this.config)
        this.modules.add(module)
        if(module.dependencies.size > 0) {
            for(const dep of module.dependencies) {
                this.buildModule(dep)
            }
        } else {
            return
        }
    }
}

module.exports = Compiler