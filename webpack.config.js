module.exports = {
  devtool: 'eval-source-map',
  entry: './index.js',
  output: {
    path: './dist',
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
  devServer: {
    port: 8080,
    color: true,
    historyApiFallback: true,
    inline: true
  }
}