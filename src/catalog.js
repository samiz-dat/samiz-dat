import path from 'path';
import Promise from 'bluebird';
import db from 'knex';
import parser from 'another-name-parser';
import chalk from 'chalk';

import DatWrapper, { listDatContents, importFiles } from './dat';
import { opf2js } from './opf';
import { getDirectories, notADir } from './utils/filesystem';
// @todo: this.db.close(); should be called on shutdown

// Class definition
export class Catalog {
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.dats = [];
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
  }

  initDatabase() {
    return this.db.schema.createTableIfNotExists('dats', (table) => {
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
    .catch(e => console.error(e))
    .then(this.getDats)
    .then(console.log);
  }

  // Every imported and added dat gets added to the `dats` table of the database. If
  // the directories are deleted then these db entries are useless and should be removed.
  // This will simply confirm that every dat directory in the db still exists.
  cleanupDatsRegistry() {
    console.log('Cleaning up the dats registry');
    return this.getDats()
      .map(dat => dat)
      .filter(dat => notADir(dat.dir))
      .each((dat) => {
        console.log(`Removing: ${chalk.bold(dat.dir)} (directory does not exist)`);
        return this.removeDatFromDb(dat.dat)
          .then(() => this.clearDatEntries(dat.dat));
      })
      .then(() => this);
  }

  // Look inside the base directory for any directories that seem to be dats
  discoverDats() {
    return getDirectories(this.baseDir)
      .map((name) => {
        console.log(`Attempting to load dir: ${chalk.bold(name)} as a dat`);
        const opts = {
          name,
          createIfMissing: false,
          sparse: true,
        };
        return this.importDat(opts);
      })
      .then(() => this.cleanupDatsRegistry())
      .then(() => this.importDatsFromDB())
      .then(() => this);
  }

  // Imports dats listed in the dats table of the database
  importDatsFromDB() {
    this.getDats()
      .map(dat => dat)
      .filter(dat => notADir(dat.dir)) // directory exists
      .filter(dat => !dat.dir.startsWith(this.baseDir)) // not in data directory
      .filter(dat => !(dat.key in this.dats.keys())) // not in registry
      .each(dat => this.importDir(dat.dir, dat.name))
      .then(() => console.log('Imported dats from DB'));
  }

  // Imports a directory on the local filesystem as a dat.
  // This should not be called on any directories inside `dataDir`, which are loaded differently
  importDir(directory, name) {
    console.log(`Attempting to import local directory: ${directory}`);
    const opts = {
      directory,
      name,
    };
    return this.importDat(opts);
  }

  // Does the work of importing a functional dat into the catalog
  importDat(opts) {
    if ('key' in opts && opts.key in this.dats) {
      // The dat is already loaded, we shouldn't reimport it
      console.log(`You are trying to import a dat that is already loaded: ${opts.key}`);
      return Promise.resolve(false);
    }
    if (!opts.directory) {
      opts.directory = path.format({
        dir: this.baseDir,
        base: (opts.name) ? opts.name : opts.key,
      });
    }
    const newDat = new DatWrapper(opts, this);
    return newDat.run()
      .then(() => this.registerDat(newDat))
      .then(() => importFiles(newDat))
      .then(() => listDatContents(newDat.dat))
      .each(entry => this.importDatEntry(newDat, entry))
      .catch((err) => {
        console.log(`* Something went wrong when importing ${opts.directory}`);
        console.log(err);
      });
  }

  // Registers dat in catalog array and in database (@todo)
  registerDat(dw) {
    const datkey = dw.dat.key.toString('hex');
    console.log(`Adding dat (${datkey}) to the catalog.`);
    return this.removeDatFromDb(datkey)
      .then(() => this.clearDatEntries(datkey))
      .then(() => this.addDatToDb(datkey, dw.name, dw.directory))
      .finally(() => { this.dats[datkey] = dw; })
      .catch(e => console.log(e));
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
    if (arr[0] === '') {
      arr.shift();
    }
    if (arr.length > 2) {
      console.log(chalk.bold('adding:'), entry.name);
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

  // Checks out an item by author and title and dat
  // @todo: make this work... not actually downloading yet
  checkout(author, title, datKey) {
    console.log(`checking out ${author}/${title} from ${datKey}`);
    return this.dats[datKey].downloadContent(path.join(author, title));
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

  getDatsWithTitle(author, title) {
    return this.db('texts')
      .distinct('dat')
      .where('author', author)
      .where('title', title);
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

  getDats = () => this.db('dats').select();

  // Returns opf metadata object for an item, optionally preferring a specific library.
  getOpf(author, title, dat = false) {
    const mfn = 'metadata.opf'; // metadata file name
    return this.getFiles(author, title, dat, mfn).first()
      .then(row => this.pathToDat(row.dat))
      .then(fp => opf2js(path.join(fp.dir, author, title, mfn)));
  }

}

export function createCatalog(dataDir) {
  const catalog = new Catalog(dataDir);
  return catalog.initDatabase().then(() => catalog);
}

export default Catalog;
