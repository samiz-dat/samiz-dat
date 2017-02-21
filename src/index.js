import path from 'path';
import Dat from 'dat-node';
import _ from 'lodash';
import Promise from 'bluebird';
import chalk from 'chalk';

const testDir = path.join(process.cwd(), 'test-dir');

const opts = {
  key: 'fbdf68b3d65bd1cb46057d9b014a8db269a969185e435f683222d05f0809570e',
  sparse: true,
};

async function start(dat) {
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
    console.log(chalk.gray(chalk.bold('downloading:'), data));
  });

  let list = await archiveList();
  list = list.map(entry => _.pick(entry, ['name', 'type']));
  list.forEach(({ type, name }) => {
    console.log((type === 'file') ? chalk.bold(name) : name);
  });
}

Dat(testDir, opts, (err, dat) => {
  if (err) {
    console.error(err);
    return;
  }
  // setup error
  const exitHandler = options => (error) => {
    if (options.cleanup) {
      console.log('cleaning up!');
      dat.leave();
    }
    if (error) console.log(error.stack);
    if (options.exit) process.exit();
  };

  process.on('exit', exitHandler({ cleanup: true }));
  process.on('SIGINT', exitHandler({ exit: true }));
  process.on('uncaughtException', exitHandler({ exit: true }));

  start(dat)
    .catch((error) => {
      console.error(error);
      process.exit();
    });
});
