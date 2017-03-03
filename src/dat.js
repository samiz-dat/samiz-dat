import fs from 'fs';
import createDat from 'dat-node';
import _ from 'lodash';
import Promise from 'bluebird';
import chalk from 'chalk';
import pda from 'pauls-dat-api';


// Lists the contents of a dat
export function listDatContents(dat) {
  const archive = dat.archive;
  const archiveList = Promise.promisify(archive.list, { context: archive });
  return archiveList();
}

export function listDatContents2(dat) {
  return pda.listFiles(dat.archive, '/');
}

/**
 * Adds Library-ish functions to a Dat. Expects the Dat's directory structure to
 * follow Calibre's (Author Name/ Publication Title/ Files)
 */
export default class DatWrapper {
  constructor(opts) {
    this.directory = opts.directory;
    // create if it doesn't exist
    if (!fs.existsSync(opts.directory)) {
      fs.mkdirSync(opts.directory);
    }
    this.key = opts.key;
    this.name = opts.name;
    this.opts = opts;
  }

  // Creates a dat and grabs a key
  // Perhaps this gets rewritten to be more like beaker:
  // https://github.com/beakerbrowser/beaker/blob/2c2336430bdb00ea8e47e13fb2e8c8d5b89440ea/app/background-process/networks/dat/dat.js#L231
  run() {
    return this.create()
      .then((dat) => {
        this.key = dat.key.toString('hex');
        const network = dat.joinNetwork();
        const stats = dat.trackStats();
        this.dat = dat;
        stats.once('update', () => {
          console.log('stats updated', stats.get());
        });
        network.once('connection', () => {
          console.log('connects via network');
          console.log(chalk.gray(chalk.bold('peers:'), network.connected));
        });
        // this.start(dat);
      })
      .then(() => this);
  }

  // Just creates a dat object
  create() {
    const createDatAsync = Promise.promisify(createDat);
    return createDatAsync(this.directory, this.opts);
  }

  // Lists the contents of a dat
  listContents() {
    const archive = this.dat.archive;
    const archiveList = Promise.promisify(archive.list, { context: archive });
    return archiveList();
  }

  // Download a file or directory
  downloadContent(fn) {
    console.log(`Downloading: /${fn}`);
    return pda.download(this.dat.archive, `/${fn}`);
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
