const { jsLoader } = require('./loaders/jsLoader');

module.exports = {
  entry: './index.js',
  output: './public',
  rules: [{
    test: /\.js/,
    loaders: [jsLoader],
  }],
};
