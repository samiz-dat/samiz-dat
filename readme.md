<p align="center">
  <br>
  <img width="256" src="https://github.com/e-e-e/dat-library/blob/master/static/icons/256x256.png?raw=true" alt="dat library">
  <br>
  <br>
</p>

# Samiz-Dat (formerly, Dat Library)

> “THE LIBRARY IS A GROWING ORGANISM.”
> — S.R Ranganathan

Let’s say you have a collection of an out-of-print, obscure, radical zine from Sydney in the 1970s; or you have collected the writings of your comrades; or you have a directory of your own texts that are currently unpublished or otherwise inaccessible. With Samiz-Dat you can share them easily with others.

 Samiz-Dat (formerly, Dat Library) is a library of libraries. What makes  Samiz-Dat special is that there is no central server hosting the files. The files are collectively hosted and distributed by the readers of those libraries. Every one of these libraries have their own public key. Using a library’s key, you can access that library’s content. Sharing the key for your own libraries lets others gain access to yours. By downloading libraries and keeping the application running, you help provide mutual support in the form of disk space and bandwidth and redundancy for the libraries you have downloaded.

For a longer read about Samiz-Dat - have a read of [README.md](https://samiz-dat.github.io/hyperreadings/) published in [Distributed](http://www.openeditions.com/index.php/distributed.html) edited by David Blamey & Brad Haylock.

We have a [road map](https://github.com/samiz-dat/samiz-dat/wiki/Roadmap) of sorts.

## How to Install?

Download the latest release [here](https://github.com/samiz-dat/samiz-dat/releases).

Looking for a CLI? Have a look at [dat-cardcat](https://github.com/samiz-dat/dat-cardcat).

This is very much alpha software and in need of your support. We are actively developing - if you find bugs or issues please let us know on [github issues](https://github.com/samiz-dat/samiz-dat/issues). If you are using Samiz-Dat and desire a feature - don't hesitate to make a request.

## Development

**Note:** Node and electron have different versions of NODE_MODULE_VERSION and as such need dependent libraries compiled seporately.
To install modules for electron:
```
# Electron's version.
export npm_config_target=1.8.4
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

## Dev Tools

To access Vue devtools in Electron you must install them in chrome first.

