const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  entry: './src/index.js',
  resolve: {
    extensions: ['.js', '.json'],
    enforceExtension: false,
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }
    ],
  },
  plugins: [
    new webpack.ExternalsPlugin('commonjs', [
      'electron',
      'dat-node',
      'sqlite3',
    ]),
  ],
};
