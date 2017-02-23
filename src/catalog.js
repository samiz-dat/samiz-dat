import path from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import DatWrapper from './dat';

module.exports = Catalog

// @todo: this.db.close(); should be called on shutdown

// create a test Dat
const initDat = function(opts, cb) {
	return new DatWrapper(opts, cb);
}

function Catalog(baseDir) {
	this.baseDir = baseDir;
	this.dats = [];
	// Catalog is kept in the datastore
	this.initDb();
}

Catalog.prototype.initDb = function() {
	sqlite3.verbose();
	const db = new sqlite3.Database(path.format({ 
		dir: this.baseDir, 
		base: 'catalog.db'
	}));
	db.serialize(function() {
		db.run("CREATE TABLE IF NOT EXISTS texts (dat TEXT, title_hash TEXT, file_hash TEXT, author TEXT, title TEXT, file TEXT)");
	});
	this.db = db;
}

Catalog.prototype.importDat = function(opts) {
	if (!opts.directory) {
		opts.directory = path.format({
			dir: this.baseDir, 
			base: (opts.name) ? opts.name : opts.key
		});
	}
	this.addDat(initDat(opts, this));
}

// Add a dat
Catalog.prototype.addDat = function(dat) {
	this.clearDatEntries(dat);
	this.dats[dat.key] = dat;
}

// Remove all entries for a dat
Catalog.prototype.clearDatEntries = function(dat) {
	this.db.run("DELETE FROM texts WHERE dat=?", dat.key, function (err) {
		console.log(this.changes + " entries cleared from db with dat key: " + dat.key);
	});
}

// Callback for adding an entry from a Dat
// In this context `this` is the DatWrapper
Catalog.prototype.addDatEntry = function(dat, entry, self) {
	let arr = entry.name.split(path.sep);
	arr.shift();
	if (arr.length>2) {
		self.db.run("INSERT INTO texts VALUES (?, ?, ?, ?, ?, ?)",
			dat.key, '', '', arr[0], arr[1], arr[2], 
			function (err, obj) {
			//
		});
	}
}

// Gets a count of authors in the catalog
Catalog.prototype.getAuthors = function(cb) {
	this.db.all("SELECT author, COUNT(title) as count FROM texts GROUP BY author", function(err, rows) {
		cb(err, rows);
	});
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
