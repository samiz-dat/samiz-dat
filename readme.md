# Dat Library

The beginings of a distributed library.

THIS READ ME NEEDS ATTENTION!

## Setup

**Note:** Node and electron have different versions of NODE_MODULE_VERSION and as such need dependent libraries compiled seporately.
To install modules for electron:
```
# Electron's version.
export npm_config_target=1.7.2
# The architecture of Electron, can be ia32 or x64.
export npm_config_arch=x64
export npm_config_target_arch=x64
# Download headers for Electron.
export npm_config_disturl=https://atom.io/download/electron
# Tell node-pre-gyp that we are building for Electron.
export npm_config_runtime=electron
# Tell node-pre-gyp to build module from source code.
export npm_config_build_from_source=true
# Install all dependencies, and store cache to ~/.electron-gyp.
HOME=~/.electron-gyp npm install
```
For more infomation look at the [electron docs on using native modules](https://electron.atom.io/docs/tutorial/using-native-node-modules/).

```bash
# run in development
# - first start up a webpack process
npm run dev

# build for production
npm run build
npm run start
```

For testing, the first time you run, you should do:
```
npm run cli --dat=96171cc0845174e7e3c73592479cd9ca8d4caf1d039e6f38a0c06f48dff88bd1 --name="South Asian Scholarship"
```

and then look inside src/cli.js for some other commands you can run, such as:
```
npm run cli --checkout --author="Ackbar Abbas" --title="Hong Kong Culture and the Politics of Disappearance (58)"
```

## Dev

To access Vue devtools in Electron you must install them in chrome first.

