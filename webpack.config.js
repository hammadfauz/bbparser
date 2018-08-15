var path = require('path');

module.exports = {
  entry : __dirname+'/src/index.js',
  output : {
    path : __dirname+'/lib/',
    filename : 'main.js'
  },
  module : {
    rules : [{
      test : /\.js$/,
      loader : 'babel-loader?presets[]=es2015'
    }]
  },
  mode : 'production'
};
