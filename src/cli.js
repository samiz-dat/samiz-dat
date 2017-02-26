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
// npm run cli --getTitles --author="Author Name"
} else if (process.env.npm_config_getTitles
  && process.env.npm_config_author) {
  const c = initCatalog();
  c.getTitlesForAuthor(process.env.npm_config_author, (err, docs) => {
    if (!docs.length) {
      console.log(`No titles for: ${process.env.npm_config_author}`);
    }
    for (const doc of docs) {
      console.log(`${doc.title} in dat:${doc.dat}`);
    }
  });
// npm run cli --getFiles --author="Author Name" --title="Title of text"
} else if (process.env.npm_config_getFiles
  && process.env.npm_config_author
  && process.env.npm_config_title) {
  const c = initCatalog();
  c.getFiles(process.env.npm_config_author, process.env.npm_config_title, (err, docs) => {
    if (!docs.length) {
      console.log('No files');
    }
    for (const doc of docs) {
      console.log(`${doc.file} in dat:${doc.dat}`);
    }
  });
  // npm run cli --getMetadata --author="Author Name" --title="Title of text"
} else if (process.env.npm_config_getMetadata
    && process.env.npm_config_author
    && process.env.npm_config_title) {
  console.log('This is not working!!!');
  const c = initCatalog();
  c.getFiles(process.env.npm_config_author, process.env.npm_config_title, (err, docs) => {
    let bestMatch = false;
    for (const d of docs.filter(doc => doc.file === 'metadata.opf')) {
      bestMatch = d;
    }
    if (bestMatch) {
      const p = c.pathToDat(bestMatch.dat);
      console.log(p);
      if (p) {
        console.log(path.join(p, author, title, bestMatch.file));
      }
    }
    console.log('There was no metadata file available');
  });
} else { // by default print help
  console.log('--numAuthors\tPrint the number of authors in the catalog');
  console.log('--listAuthors\tLists the authors in the catalog');
  console.log('--search\tQueries the catalog');
  console.log('--getTitles --author="Author Name"');
  console.log('--getFiles --author="Author Name" --title="Title of text"');
  console.log('--getMetadata --author="Author Name" --title="Title of text"');
  console.log('--opf=/dir/to/file.opf');
}
