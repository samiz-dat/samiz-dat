# Dat Library

The beginings of a distributed library.

## Setup

**Note:** Node and electron have different versions of NODE_MODULE_VERSION and as such need dependent libraries compiled seporately.
To install modules for electron:
```
# Electron's version.
export npm_config_target=1.6.11
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
npm run dev

# build for production
npm run build
```

## Dev

To access Vue devtools in Electron you must install them in chrome first.

