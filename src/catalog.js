import path from 'path';
import fs from 'fs';
import db from 'knex';
import parser from 'another-name-parser';
import DatWrapper, { listDatContents } from './dat';
import { opf2js } from './opf';

// @todo: this.db.close(); should be called on shutdown

// @todo: Move this to some utilities place, it is not specific to catalog
function getDirectories(srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
}

// Class definition
export default class Catalog {
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.dats = [];
    // Catalog is kept in the datastore
    this.initDb();
  }

  initDb() {
    this.db = db({
      client: 'sqlite3',
      connection: {
        filename: path.format({
          dir: this.baseDir,
          base: 'catalog.db',
        }),
      },
      useNullAsDefault: true,
    });
    this.db.schema.createTableIfNotExists('dats', (table) => {
      table.string('dat');
      table.string('name');
      table.string('dir');
      // table.unique('dat');
    })
    .createTableIfNotExists('texts', (table) => {
      table.string('dat');
      table.string('title_hash');
      table.string('file_hash');
      table.string('author');
      table.string('author_sort');
      table.string('title');
      table.string('file');
    })
    .createTableIfNotExists('more_authors', (table) => {
      table.string('title_hash');
      table.string('author');
      // table.unique('title_hash');
    })
    .catch(e => console.error(e));
  }

  // Look inside the base directory for any directories that seem to be dats
  discoverDats() {
    const dirs = getDirectories(this.baseDir);
    for (const d of dirs) {
      console.log(`Attempting to load ${d} as a dat`);
      const opts = {
        createIfMissing: false,
        name: d,
        sparse: true,
      };
      this.importDat(opts);
    }
  }

  // Does the work of importing a functional dat into the catalog
  importDat(opts) {
    if (!opts.directory) {
      opts.directory = path.format({
        dir: this.baseDir,
        base: (opts.name) ? opts.name : opts.key,
      });
    }
    const newDat = new DatWrapper(opts, this);
    newDat.run()
      .then(dw => this.registerDat(dw))
      .then(dw => listDatContents(dw.dat))
      .each(entry => this.importDatEntry(newDat, entry))
      .catch(err => console.log(`* Something went wrong when importing ${opts.directory}`));
  }

  // Registers dat in catalog array and in database (@todo)
  registerDat(dw) {
    const datkey = dw.dat.key.toString('hex');
    console.log(`Adding dat (${datkey}) to the catalog.`);
    this.removeDatFromDb(datkey)
      .then(() => this.clearDatEntries(datkey))
      .then(() => this.addDatToDb(datkey, dw.name, dw.directory))
      .finally(() => { this.dats[datkey] = dw; })
      .catch(e => console.log(e));
    return dw;
  }

  addDatToDb(dat, name, dir) {
    return this.db.insert({ dat, name, dir }).into('dats');
  }

  removeDatFromDb(datKey) {
    return this.db('dats').where('dat', datKey).del();
  }

  // Remove all entries for a dat
  clearDatEntries(datKey) {
    return this.db('texts').where('dat', datKey).del();
  }

  // Adds an entry from a Dat
  importDatEntry(dat, entry) {
    const arr = entry.name.split(path.sep);
    arr.shift();
    if (arr.length > 2) {
      const name = parser(arr[0]);
      return this.db.insert({
        dat: dat.key,
        title_hash: '',
        file_hash: '',
        author: arr[0],
        author_sort: `${name.last}, ${name.first}`,
        title: arr[1],
        file: arr[2],
      }).into('texts');
    }
    return Promise.resolve(false);
  }

  // Returns the path to a dat
  // This is broken until i can understand making sqlite async
  pathToDat(datKey) {
    return this.db.select('dir').from('dats').where('dat', datKey).first();
  }

  // Gets a count of authors in the catalog
  search(query) {
    const s = `%${query}%`;
    return this.db('texts')
      .where('title', 'like', s)
      .orWhere('author', 'like', s)
      .orderBy('author_sort', 'title_sort');
  }

  // Gets a count of authors in the catalog
  getAuthors() {
    return this.db.select('author').from('texts')
      .countDistinct('title as count')
      .groupBy('author')
      .orderBy('author_sort');
  }

  getTitlesForAuthor(author) {
    return this.db('texts')
      .distinct('dat', 'title')
      .where('author', author)
      .orderBy('title');
  }

  // Optionally only include files from a particular dat.
  // Optionally specify a filename to find.
  getFiles(author, title, dat = false, file = false) {
    const exp = this.db('texts')
      .where('author', author)
      .where('title', title);
    if (dat) {
      exp.where('dat', dat);
    }
    if (file) {
      exp.where('file', file);
    }
    return exp.orderBy('dat', 'file');
  }

  // Returns opf metadata object for an item, optionally preferring a specific library.
  getOpf(author, title, dat = false) {
    const mfn = 'metadata.opf'; // metadata file name
    return this.getFiles(author, title, dat, mfn).first()
      .then(row => this.pathToDat(row.dat))
      .then(fp => opf2js(path.join(fp.dir, author, title, mfn)));
  }

}
