import fs from 'fs';
import Dat from 'dat-node';
import _ from 'lodash';
import Promise from 'bluebird';
import chalk from 'chalk';

/**
 * Adds Library-ish functions to a Dat. Expects the Dat's directory structure to
 * follow Calibre's (Author Name/ Publication Title/ Files)
 */

export default class DatWrapper {
  constructor(opts, listener) {
    this.directory = opts.directory;
    // create if it doesn't exist
    if (!fs.existsSync(opts.directory)) {
      fs.mkdirSync(opts.directory);
    }
    this.key = opts.key;
    this.name = opts.name;
    this.listener = listener;
    this.dat = this.initDat();
  }

  initDat() {
    const opts = {
      key: this.key,
      sparse: true,
    };

    return Dat(this.directory, opts, (err, dat) => {
      if (err) {
        console.error(err);
        return;
      }
      // setup error
      process.on('exit', this.exitHandler({ cleanup: true }));
      process.on('SIGINT', this.exitHandler({ exit: true }));
      process.on('uncaughtException', this.exitHandler({ exit: true }));

      this.start(dat)
        .catch((error) => {
          console.error(error);
          process.exit();
        });
    });
  }

  exitHandler = options => (error) => {
    if (options.cleanup) {
      console.log('cleaning up!');
      if (this.dat) this.dat.leave();
    }
    if (error) console.log(error.stack);
    if (options.exit) process.exit();
  };

  start = async (dat) => {
    const archive = dat.archive;
    const archiveList = Promise.promisify(archive.list, { context: archive });

    const network = dat.joinNetwork();
    const stats = dat.trackStats();
    stats.once('update', () => {
      console.log('stats updated', stats.get());
    });

    network.once('connection', () => {
      console.log('connects via network');
      console.log(chalk.gray(chalk.bold('peers:'), network.connected));
    });

    archive.on('download', (data) => {
      // console.log(chalk.gray(chalk.bold('downloading:'), data));
    });

    let list = await archiveList();
    list = list.map(entry => _.pick(entry, ['name', 'type']));
    list.forEach(({ type, name }) => {
      this.listener.addDatEntry(this, { type, name }, this.listener);
      // console.log((type === 'file') ? chalk.bold(name) : name);
    });
  }
}
