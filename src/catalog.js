import path from 'path';
import fs from 'fs';
import Datastore  from 'nedb-core';
import DatWrapper from './dat';

module.exports = Catalog


// create a test Dat
const initDat = function(opts, cb) {
	return new DatWrapper(opts, cb);
}

function Catalog(baseDir) {
	this.baseDir = baseDir;
	this.dats = [];
	// Catalog is kept in the datastore
	//console.log("Creating database at catalog.db");
	this.db = new Datastore({ 
		filename: path.format({ 
			dir: this.baseDir, 
			base: 'catalog.db'
		}), 
		autoload: true 
	});
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
	this.db.remove({ dat: dat.key }, { multi: true }, function (err, numRemoved) {
		console.log(numRemoved + " entries cleared from db with dat key: " + dat.key);
	});
}

// Callback for adding an entry from a Dat
// In this context `this` is the DatWrapper
Catalog.prototype.addDatEntry = function(dat, entry, self) {
	let arr = entry.name.split(path.sep);
	arr.shift();
	if (arr.length>2) {
		self.db.insert({
			dat: dat.key,
			author: arr[0],
			title: arr[1],
			file: arr[2]
		}, function (err, newDoc) {
			//
		});
	}
}

// Gets a count of authors in the catalog
Catalog.prototype.getAuthors = function(cb) {
	this.db.find({}).group({
			key: {
			    'author': 1,
			},
			reduce: function (curr, result) {
			    result.count++;
			},
			initial: {
			    count: 0,
			},
		}).exec(function (err, docs) {
			cb(err, docs);
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
