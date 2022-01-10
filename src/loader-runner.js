function runLoaders(source, loaders) {
    let newSource = source
    while(loaders.length > 0) {
        const loader = loaders[loaders.length - 1]
        newSource = loader(newSource)
        loaders.pop()
    }
    return newSource
}

module.exports = {
    runLoaders
}