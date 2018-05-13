let path = require('path');
let webpack = require('webpack');
let WebpackNotifierPlugin = require('webpack-notifier');
let nodeExternals = require('webpack-node-externals')


//'babel-polyfill': 'babel-polyfill',
module.exports = [{
  target: 'electron-renderer',
  externals: [nodeExternals({whitelist:['uuid/v4']})],
  entry: {'./server_bundle': './app.js'},
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
},{
  target: 'web',
  entry: {'./client/compile/bundle':'./client/js/main.js'},
  output: {path: __dirname, filename: '[name].js'},
  mode: 'development',

  module: {
    rules: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          plugins: [
            ['babel-plugin-transform-builtin-extend', {globals: ['Image']}]
          ],
          presets: ['react']
        }
      }
    ]
  },
  plugins: [new WebpackNotifierPlugin({alwaysNotify: true})]
}];
