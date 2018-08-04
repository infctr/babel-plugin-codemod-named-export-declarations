const path = require('path');
const pluginTester = require('babel-plugin-tester');
const plugin = require('../');

pluginTester({
  plugin,
  babelOptions: {
    parserOpts: {
      plugins: ['typescript'],
    },
  },
  fixtures: path.join(__dirname, '__fixtures__'),
});
