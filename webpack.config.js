const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const cssnext = require('postcss-cssnext');
const precss = require('precss');
const scss =require('postcss-scss');
const atImport = require("postcss-import");
const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
  target: 'node',
  entry: './src/client/index.js',
  stats: { children: false },
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    enforceExtension: false,
    alias: {
      'store': path.resolve(__dirname, 'src/client/store/'),
      'routes': path.resolve(__dirname, 'src/client/routes/'),
      'containers': path.resolve(__dirname, 'src/client/containers/'),
      'components': path.resolve(__dirname, 'src/client/components/'),
      'assets': path.resolve(__dirname, 'src/client/assets/'),
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
        options: {
          optimizeSSR: false,
          loaders: {
            css: ExtractTextPlugin.extract({
              use: 'css-loader',
              fallback: 'vue-style-loader'
            }),
            // less: ExtractTextPlugin.extract({
            //   use: ['css-loader', 'less-loader'],
            //   fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
            // }),
            scss: ExtractTextPlugin.extract({
              use: ['css-loader', 'sass-loader'],
              fallback: 'vue-style-loader'
            })
          },
          postcss: {
            plugins: [
              atImport(),
              precss(),
              cssnext({
                browsers: ['last 2 versions'],
              }),
            ],
          },
        },
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(jpe?g|png|gif|eot|ttf|woff2|woff?)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/[name].[hash].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
        title: 'config.title',
        template: path.resolve(__dirname, 'src/client/index.html'),
        filename: '../dist/index.html',
      }),
    new webpack.ExternalsPlugin('commonjs', [
      'electron',
      'dat-cardcat',
    ]),
  ],
};
