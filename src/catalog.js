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
      .then(dw => this.registerDat(dw))
      .then(dw => listDatContents(dw.dat))
      .each(entry => this.importDatEntry(newDat, entry))
      .catch(err => console.log(`* Something went wrong when importing ${opts.directory}`));
  }

  // Registers dat in catalog array and in database (@todo)
  registerDat(dw) {
    const datkey = dw.dat.key.toString('hex');
    console.log(`Adding dat (${datkey}) to the catalog.`);
    this.removeDatFromDb(datkey);
    this.addDatToDb(datkey, dw.name, dw.directory);
    this.clearDatEntries(datkey);
    this.dats[datkey] = dw;
    return dw;
  }

  addDatToDb(key, name, dir) {
    this.db.run('INSERT INTO dats VALUES (?, ?, ?)',
      key, name, dir,
      (err) => {
        if (err) console.error(err);
      });
  }

  removeDatFromDb(datKey) {
    this.db.run('DELETE FROM dats WHERE dat=?', datKey, (err) => {
      if (err) console.error(err);
    });
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

  // Returns the path to a dat
  // This is broken until i can understand making sqlite async
  pathToDat(datKey) {
    let p = false;
    const sql = 'SELECT * FROM dats WHERE dat=?';
    this.db.get(sql, datKey, (err, row) => { if (row) p = row.dir; console.log(row);});
    return p; // @todo: throw?
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

  getTitlesForAuthor(author, cb) {
    const sql = 'SELECT DISTINCT title, dat FROM texts WHERE author LIKE ? ORDER BY title';
    this.db.all(sql, author, (err, rows) => cb(err, rows));
  }

  getFiles(author, title, cb) {
    const sql = 'SELECT * FROM texts WHERE author=? AND title=? ORDER BY dat, file';
    this.db.all(sql, author, title, (err, rows) => cb(err, rows));
  }

}
