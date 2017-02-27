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
  c.getAuthors()
  .then((rows) => {
    console.log(`${rows.length} authors`);
  })
  .catch(e => console.log(e));
// npm run cli --dat=datkey --name="A Nice Name"
} else if (process.env.npm_config_dat) {
  const c = initCatalog();
  c.discoverDats().then(() =>
    c.importDat({
      key: process.env.npm_config_dat,
      name: process.env.npm_config_name }))
  .catch(e => console.log(e));
// npm run cli --listAuthors
} else if (process.env.npm_config_listAuthors) {
  const c = initCatalog();
  c.getAuthors()
  .then((rows) => {
    for (const doc of rows) {
      console.log(`${doc.author} (${doc.count} items)`);
    }
  })
  .catch(e => console.log(e));
// npm run cli --search=query
} else if (process.env.npm_config_search) {
  const c = initCatalog();
  c.search(process.env.npm_config_search)
    .then((rows) => {
      for (const doc of rows) {
        console.log(`${doc.author}, "${doc.title}"`);
      }
    })
    .catch(e => console.log(e));
// npm run cli --opf=/dir/to/file.opf
} else if (process.env.npm_config_opf) {
  opf2js(process.env.npm_config_opf).then(data =>
    console.log(data.authors),
   );
// npm run cli --getTitles --author="Author Name"
} else if (process.env.npm_config_getTitles
  && process.env.npm_config_author) {
  const c = initCatalog();
  c.getTitlesForAuthor(process.env.npm_config_author)
    .then((rows) => {
      for (const doc of rows) {
        console.log(`${doc.title} in dat:${doc.dat}`);
      }
    })
    .catch(e => console.log(e));
// npm run cli --getFiles --author="Author Name" --title="Title of text"
} else if (process.env.npm_config_getFiles
  && process.env.npm_config_author
  && process.env.npm_config_title) {
  const c = initCatalog();
  c.getFiles(process.env.npm_config_author, process.env.npm_config_title)
    .then((rows) => {
      for (const doc of rows) {
        console.log(`${doc.file} in dat:${doc.dat}`);
      }
    })
    .catch(e => console.log(e));
  // npm run cli --getOpf --author="Author Name" --title="Title of text"
} else if (process.env.npm_config_getOpf
    && process.env.npm_config_author
    && process.env.npm_config_title) {
  const c = initCatalog();
  c.getOpf(process.env.npm_config_author, process.env.npm_config_title)
    .then((opf) => {
      console.log(`Title: ${opf.title}`);
      console.log(`Authors: ${opf.authors}`);
      console.log('Identifiers:');
      for (const i of opf.identifiers) {
        console.log(i);
      }
      console.log(`Description: ${opf.description}`);
      console.log(`An undefined field: ${opf.undefined}`);
    })
    .catch(e => console.log(e));
} else { // by default print help
  console.log('--dat=datkey --name="A Nice Name"\tImport a new dat to your catalog');
  console.log('--numAuthors\tPrint the number of authors in the catalog');
  console.log('--listAuthors\tLists the authors in the catalog');
  console.log('--search\tQueries the catalog');
  console.log('--getTitles --author="Author Name"');
  console.log('--getFiles --author="Author Name" --title="Title of text"');
  console.log('--getOpf --author="Author Name" --title="Title of text"');
  console.log('--opf=/dir/to/file.opf');
}
