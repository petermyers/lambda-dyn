const path = require('path');

module.exports = {
  entry: './src/client/main.js',
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '../..', '.client-webpack'),
    filename: '[name].js'
  },
  optimization: {
    minimize: true
  },
  target: 'node',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
          }
        ],
        // include: __dirname,
        // exclude: /node_modules/
      }
    ]
  }
};