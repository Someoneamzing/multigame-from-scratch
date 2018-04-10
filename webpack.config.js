let path = require('path');
let webpack = require('webpack');

module.exports = {
  target: 'electron-renderer',
  entry: ['babel-polyfill','./client/js/main.js'],
  output: {path: __dirname, filename: './client/compile/bundle.js'},

  module: {
    rules: [
      {
        loader: 'babel-loader',
        //exclude: /node_modules/,
        query: {
          presets: [['env',{targets:{browsers: ["last 2 versions"]}}]],
          plugins: [
            ['babel-plugin-transform-builtin-extend', {globals: ['Image']}]
          ]
        }
      }
    ]
  }
};
