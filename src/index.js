import path from 'path';
import Dat from 'dat-node';

const testDir = path.join(process.cwd(), 'test-dir');

const opts = {
  key: 'fbdf68b3d65bd1cb46057d9b014a8db269a969185e435f683222d05f0809570e',
};

Dat(testDir, opts, (err, dat) => {
  if (err) {
    console.error(err);
    return;
  }
  const archive = dat.archive;

  // archive.list({}, (error, results) => {
  //   if (error) {
  //     console.log(error);
  //     return;
  //   }
  //   console.log('archive contents:');
  //   console.log(results);
  // });

  archive.on('download', (data) => {
    console.log('downloading', data);
  });

  archive.content.once('download-finished', () => {
    // issue w/ download-finished firing before stats updated
    console.log('finished downloading!');
  });

  // Join the network
  const network = dat.joinNetwork();
  network.once('connection', () => {
    console.log('connects via network');
    console.log('peers:', network.connected);
  });

  // Track stats
  const stats = dat.trackStats();
  stats.once('update', () => {
    console.log('stats updated', stats.get());
  });

  const exitHandler = options => (error) => {
    if (options.cleanup) {
      console.log('cleaning up!');
      dat.leave();
    }
    if (error) console.log(error.stack);
    if (options.exit) process.exit();
  };

  process.on('exit', exitHandler({ cleanup: true }));
  process.on('SIGINT', exitHandler({ cleanup: true, exit: true }));
  process.on('uncaughtException', exitHandler({ cleanup: true, exit: true }));
});
