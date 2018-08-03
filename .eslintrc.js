const { prettier } = require('./package.json');

module.exports = {
  parser: 'babel-eslint',
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'airbnb-base',
    'prettier',
    'prettier/standard',
    'plugin:prettier/recommended',
    'plugin:jest/recommended'
  ],
  plugins: ['types', 'prettier', 'jest'],
  rules: {
    'import/first': [2, { 'absolute-first': 0 }],
    'prettier/prettier': [2, prettier]
  }
};
