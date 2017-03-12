import fsOrig from 'fs';
import path from 'path';
import Promise from 'bluebird';

const fs = Promise.promisifyAll(fsOrig);


export const getDirectories = srcpath => fs.readdirAsync(srcpath) // eslint-disable-line
  .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());

// This is unusual, but I found that I cannot simply say !dirExists if dirExists returns a Promise.
// The promise always exists
export const notADir = srcpath =>
  fs.statAsync(srcpath)
    .then(stat => !stat.isDirectory())
    .catch(() => true);
