'use strict';

var path = require('path')
var webpack = require('webpack')

var RELEASE = process.env.NODE_ENV == 'production' ? true : false;

var nodeEnvPlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': RELEASE ? '"production"' : '"development"'
})

module.exports = {
  devtool: RELEASE ? [] : [
    'source-map'
  ],
  entry: [
    './example/index'
  ],
    
  output: {
    path: path.join(__dirname, 'example', 'dist'),
    filename: 'app.js'
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      react: path.resolve('./node_modules/react')
    }
  },

  plugins: RELEASE ? [

    nodeEnvPlugin,

    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    })
  ] : [
    nodeEnvPlugin
  ],

  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-1']
        }
      }

    ]
  }
};