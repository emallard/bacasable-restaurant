'use strict';

var path = require('path');

var babelOptions = {
  "presets": [
    "es2015"
  ]
};

module.exports = {
  cache: true,
  entry: {
    bundle: './src/client/application.ts',
    vendor: ['babel-polyfill']
  },
  output: {
        path: './node/public/libs',
        filename: '[name].js',
        library: '[name]'
    },
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      exclude: './node_modules',
      use: [
        {
          loader: 'babel-loader',
          options: babelOptions
        },
        {
          loader: 'ts-loader'
        }
      ]
    }, {
      test: /\.js$/,
      exclude: './node_modules',
      use: [
        {
          loader: 'babel-loader',
          options: babelOptions
        }
      ]
    }]
  },
  plugins: [
  ],
  resolve: {
    extensions: ['.ts', '.js']
  },
};
