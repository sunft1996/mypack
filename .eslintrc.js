module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    camelcase: 0,
    'no-underscore-dangle': 0,
    'no-empty': 0,
    'no-restricted-syntax': 0,
    'class-methods-use-this': 0,
  },
};
