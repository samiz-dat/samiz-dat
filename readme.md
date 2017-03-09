# Dat Library

The beginings of a distributed library.

## Setup

```bash
# install npm dependencies
npm install
# run in development
npm run dev
# build for production
npm run build
```

For testing, the first time you run, you should do:
```
npm run cli --dat=96171cc0845174e7e3c73592479cd9ca8d4caf1d039e6f38a0c06f48dff88bd1 --name="South Asian Scholarship"
```

and then look inside src/cli.js for some other commands you can run, such as:
```
npm run cli --checkout --author="Ackbar Abbas" --title="Hong Kong Culture and the Politics of Disappearance (58)"
```
