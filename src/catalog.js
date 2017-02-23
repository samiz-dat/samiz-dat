import path from 'path';
// import fs from 'fs';
import sqlite3 from 'sqlite3';
import parser from 'another-name-parser';
import DatWrapper from './dat';

// @todo: this.db.close(); should be called on shutdown

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
      db.run('CREATE TABLE IF NOT EXISTS texts (dat TEXT, title_hash TEXT, file_hash TEXT, author TEXT, author_sort TEXT, title TEXT, file TEXT)');
    });
    this.db = db;
  }

  importDat(opts) {
    if (!opts.directory) {
      opts.directory = path.format({
        dir: this.baseDir,
        base: (opts.name) ? opts.name : opts.key,
      });
    }
    this.addDat(new DatWrapper(opts, this));
  }

  addDat(dat) {
    this.clearDatEntries(dat);
    this.dats[dat.key] = dat;
  }

  // Remove all entries for a dat
  clearDatEntries(dat) {
    this.db.run('DELETE FROM texts WHERE dat=?', dat.key, function (err) {
      console.log(`${this.changes} entries cleared from db with dat key: ${dat.key}`);
    });
  }

  // Callback for adding an entry from a Dat
  // In this context `this` is the DatWrapper
  addDatEntry(dat, entry, self) {
    const arr = entry.name.split(path.sep);
    arr.shift();
    if (arr.length > 2) {
      const name = parser(arr[0]);
      self.db.run('INSERT INTO texts VALUES (?, ?, ?, ?, ?, ?, ?)',
        dat.key, '', '', arr[0], name.last, arr[1], arr[2],
        (err, obj) => {
          if (err) console.error(err);
          else console.log(obj);
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
