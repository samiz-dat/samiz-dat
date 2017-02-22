import path from 'path';
import Catalog from './catalog';

// directory of the dat
const testDir = path.join(process.cwd(), 'test-dir');

const catalog = new Catalog();

catalog.importDat({
  directory: testDir, 
  key: '96171cc0845174e7e3c73592479cd9ca8d4caf1d039e6f38a0c06f48dff88bd1',
  name: 'Grr'
  })