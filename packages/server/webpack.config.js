const path = require('path');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js'
  },
  module: {
    rules: [
      { test: /\.js$|\.ts$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
}
