let path = require('path');
let webpack = require('webpack');
let WebpackNotifierPlugin = require('webpack-notifier');
let nodeExternals = require('webpack-node-externals')


//'babel-polyfill': 'babel-polyfill',
module.exports = {
  target: 'electron-renderer',
  externals: [nodeExternals({whitelist:['uuid/v4']})],
  entry: {'./client/compile/bundle':'./client/js/main.js', './server_bundle': './app.js'},
  output: {path: __dirname, filename: '[name].js'},
  mode: 'development',

  module: {
    //noParse: (content)=>{return /node_modules/.test(content)},
    rules: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          plugins: [
            ['babel-plugin-transform-builtin-extend', {globals: ['Image']}],
          ],
          presets: ['react']
        }
      }
    ]
  },
  plugins: [new WebpackNotifierPlugin({alwaysNotify: true})]
};
