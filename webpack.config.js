const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  target: 'node',
  entry: './src/index.js',
  resolve: {
    extensions: ['.js', '.json'],
    enforceExtension: false,
    alias: {
    'vue': 'vue/dist/vue.common.js',
    },
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
    new HtmlWebpackPlugin({
        title: 'config.title',
        template: path.resolve(__dirname, 'src/index.html'),
        filename: '../dist/index.html',
      }),
    new webpack.ExternalsPlugin('commonjs', [
      'electron',
      'dat-node',
      'sqlite3',
      'knex',
      'pauls-dat-api',
    ]),

  ],
};
