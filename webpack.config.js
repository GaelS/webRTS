var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/app/public');
var APP_DIR = path.resolve(__dirname, 'src/client');
var config = {
  entry: {
    app : [APP_DIR + '/main.jsx']
  },
  output: {
    path: BUILD_DIR,
    publicPath : '/assets/',
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel',
      },
    ]
  }
};

module.exports = config;
