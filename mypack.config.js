const {jsLoader} = require('./src/loaders/jsLoader')
module.exports = {
    entry: './demo/index.js',
    output: './public',
    rules: [{
        test: /\.js/,
        loaders: [jsLoader]
    }]
}