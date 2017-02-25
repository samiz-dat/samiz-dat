import path from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import parser from 'another-name-parser';
import { listDatContents, DatWrapper } from './dat';

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
    sqlite3.verbose();
    const db = new sqlite3.Database(path.format({
      dir: this.baseDir,
      base: 'catalog.db',
    }));
    db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS dats (dat TEXT, name TEXT, dir TEXT)');
      db.run('CREATE TABLE IF NOT EXISTS texts (dat TEXT, title_hash TEXT, file_hash TEXT, author TEXT, author_sort TEXT, title TEXT, file TEXT)');
      db.run('CREATE TABLE IF NOT EXISTS more_authors (title_hash TEXT, author TEXT)');
    });
    this.db = db;
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
      .then(dw => this.registerDat(dw.dat))
      .then(dat => listDatContents(dat))
      .each(entry => this.importDatEntry(newDat, entry))
      .catch(err => console.log(`* Something went wrong when importing ${opts.directory}`));
  }

  // Registers dat in catalog array and in database (@todo)
  registerDat(dat) {
    const datkey = dat.key.toString('hex');
    console.log(`Adding dat (${datkey}) to the catalog.`);
    this.clearDatEntries(datkey);
    this.dats[datkey] = dat;
    return dat;
  }

  // Remove all entries for a dat
  clearDatEntries(datkey) {
    this.db.run('DELETE FROM texts WHERE dat=?', datkey, function (err) {
      console.log(`${this.changes} entries cleared from db with dat key: ${datkey}`);
    });
  }

  // Adds an entry from a Dat
  importDatEntry(dat, entry) {
    const arr = entry.name.split(path.sep);
    arr.shift();
    if (arr.length > 2) {
      const name = parser(arr[0]);
      this.db.run('INSERT INTO texts VALUES (?, ?, ?, ?, ?, ?, ?)',
        dat.key, '', '', arr[0], name.last, arr[1], arr[2],
        (err, obj) => {
          if (err) console.error(err);
        });
    }
  }

  // Gets a count of authors in the catalog
  search(query, cb) {
    const s = `%${query}%`;
    const sql = 'SELECT * FROM texts WHERE title LIKE ? OR author LIKE ? ORDER BY author_sort';
    this.db.all(sql, s, s, (err, rows) => cb(err, rows));
  }

  // Gets a count of authors in the catalog
  getAuthors(cb) {
    const sql = 'SELECT author, author_sort, COUNT(title) as count FROM texts GROUP BY author ORDER BY author_sort';
    this.db.all(sql, (err, rows) => cb(err, rows));
  }

  /*
  // Get a list of authors. Optionally filter by library

  // Get a list of titles per author. Optionally filter by library.

  // Clear out all entries. Optionally clear out only one library.

  // Various file fetching... right now files are fetched by default, but soon
  // we'll need to be able to selectively request certain files
  //

  // Fetches OPF metadata file

  // Fetches cover image

  // Fetches all files for a particular title

  // Fetch a single file for a particular title
  */
}
