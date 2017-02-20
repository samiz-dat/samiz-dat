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

  function done() {
    console.log('done!');
  }

  archive.open(() => {
    // Network needs to connect for archive.open to callback
    archive.content.once('download-finished', () => {
      // issue w/ download-finished firing before stats updated
      setTimeout(done, 500);
    });
  });

  // Join the network
  const network = dat.joinNetwork();
  network.once('connection', () => {
    console.log('connects via network');
  });

  // Track stats
  const stats = dat.trackStats();
  stats.once('update', () => {
    console.log('stats updated');
  });

  const exitHandler = options => (error) => {
    if (options.cleanup) {
      dat.leave();
    }
    if (error) console.log(error.stack);
    if (options.exit) process.exit();
  };

  process.on('exit', exitHandler({ cleanup: true }));
  process.on('SIGINT', exitHandler({ cleanup: true, exit: true }));
  process.on('uncaughtException', exitHandler({ cleanup: true, exit: true }));
});
