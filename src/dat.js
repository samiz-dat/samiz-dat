import fs from 'fs';
import createDat from 'dat-node';
import _ from 'lodash';
import Promise from 'bluebird';
import chalk from 'chalk';


// Lists the contents of a dat
export function listDatContents(dat) {
  const archive = dat.archive;
  const archiveList = Promise.promisify(archive.list, { context: archive });
  return archiveList();
}

/**
 * Adds Library-ish functions to a Dat. Expects the Dat's directory structure to
 * follow Calibre's (Author Name/ Publication Title/ Files)
 */
export class DatWrapper {
  constructor(opts, listener) {
    this.directory = opts.directory;
    // create if it doesn't exist
    if (!fs.existsSync(opts.directory)) {
      fs.mkdirSync(opts.directory);
    }
    this.key = opts.key;
    this.name = opts.name;
    this.opts = opts;
    this.listener = listener;
  }

  // Creates a dat and grabs a key
  run() {
    return this.create()
      .then((dat) => {
        this.key = dat.key.toString('hex');
        this.dat = dat;
        // this.start(dat);
      })
      .then(() => this);
  }

  // Just creates a dat object
  create() {
    const createDatAsync = Promise.promisify(createDat);
    return createDatAsync(this.directory, this.opts);
  }

  exitHandler = options => (error) => {
    if (options.cleanup) {
      console.log('cleaning up!');
      if (this.dat) this.dat.leave();
    }
    if (error) console.log(error.stack);
    if (options.exit) process.exit();
  };

}
