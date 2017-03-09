import path from 'path';
import fs from 'fs';
import Catalog from './catalog';
import config from './config';

// Directory to store all the data in (should be a config option)
const dataDir = path.join(process.cwd(), config.get('dataDir'));
// Create data directory if it doesn't exist yet
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const catalog = new Catalog(dataDir);
catalog.discoverDats();
/*
catalog.importDat({
  key: '96171cc0845174e7e3c73592479cd9ca8d4caf1d039e6f38a0c06f48dff88bd1',
  name: 'Grr',
});
*/
