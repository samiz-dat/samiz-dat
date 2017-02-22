'use strict';var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _catalog = require('./catalog');var _catalog2 = _interopRequireDefault(_catalog);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

// directory of the dat
const testDir = _path2.default.join(process.cwd(), 'test-dir');

const catalog = new _catalog2.default();

catalog.importDat({
  directory: testDir,
  key: '96171cc0845174e7e3c73592479cd9ca8d4caf1d039e6f38a0c06f48dff88bd1',
  name: 'Grr' });