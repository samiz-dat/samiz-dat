'use strict';var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _nedb = require('nedb');var _nedb2 = _interopRequireDefault(_nedb);
var _dat = require('./dat');var _dat2 = _interopRequireDefault(_dat);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

module.exports = Catalog;


// create a test Dat
const initDat = function (opts, cb) {
	return new _dat2.default(opts, cb);
};

function Catalog() {
	this.dats = [];
	// Catalog is kept in the datastore
	this.db = new _nedb2.default({ filename: 'catalog.db', autoload: true });
}

Catalog.prototype.importDat = function (opts) {
	this.addDat(initDat(opts, this.addDatEntry));
};

// Add a dat
Catalog.prototype.addDat = function (dat) {
	this.dats[dat.key] = dat;
};

// Callback for adding an entry from a Dat
Catalog.prototype.addDatEntry = function (dat, entry) {
	let arr = entry.name.split(_path2.default.sep);
	arr.shift();
	if (arr.length > 2) {
		console.log(arr);
	}
};

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