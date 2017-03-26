'use strict';

var path = require('path');
var glob = require("glob");
var bundleFiles = glob.sync('./src/client/**/*.ts');
bundleFiles = bundleFiles.filter(function (x) {return x != './src/client/lanceur.ts'});
bundleFiles.push('./src/client/lanceur.ts');
console.log(bundleFiles);

var babelOptions = {
  "presets": [
    "es2015"
  ]
};

module.exports = {
  cache: true,
  entry: {
    bundle: bundleFiles,
    vendor: ['babel-polyfill']
  },
  output: {
        path: './node/public/build',
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
