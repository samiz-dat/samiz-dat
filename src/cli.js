import path from 'path';
import fs from 'fs';
import Catalog from './catalog';
import { opf2js } from './opf';

// Directory to store all the data in (should be a config option)
const dataDir = path.join(process.cwd(), '_data');
// Create data directory if it doesn't exist yet
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

function initCatalog() {
  return new Catalog(dataDir);
}

// npm run cli --numAuthors
if (process.env.npm_config_numAuthors) {
  const c = initCatalog();
  c.getAuthors((err, docs) => {
    console.log(`There are ${docs.length} authors`);
  });
// npm run cli --listAuthors
} else if (process.env.npm_config_listAuthors) {
  const c = initCatalog();
  c.getAuthors((err, docs) => {
    for (const doc of docs) {
      console.log(`${doc.author} (${doc.count} items)`);
    }
  });
// npm run cli --search=query
} else if (process.env.npm_config_search) {
  const c = initCatalog();
  c.search(process.env.npm_config_search, (err, docs) => {
    if (!docs.length) {
      console.log(`0 results for "${process.env.npm_config_search}"`);
    }
    for (const doc of docs) {
      console.log(`${doc.author} : ${doc.title}`);
    }
  });
// npm run cli --opf=/dir/to/file.opf
} else if (process.env.npm_config_opf) {
  opf2js(process.env.npm_config_opf).then(data =>
    console.log(data.authors),
   );
} else { // by default print help
  console.log('--numAuthors\tPrint the number of authors in the catalog');
  console.log('--listAuthors\tLists the authors in the catalog');
  console.log('--search\tQueries the catalog');
}
