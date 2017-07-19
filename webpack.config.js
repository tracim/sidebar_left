const webpack = require('webpack')
const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  entry: './sidebarLeft.jsx',
  output: {
    libraryTarget: 'var',
    library: 'sidebarLeft',
    path: path.resolve(__dirname, 'dist'),
    filename: 'sidebarleft.js',
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      enforce: 'pre',
      use: 'standard-loader',
      exclude: [/node_modules/]
    }, {
      test: [/\.js$/, /\.jsx$/],
      loader: 'babel-loader',
      options: {
        presets: ['react', 'es2015'],
        plugins: ['transform-object-rest-spread', 'transform-class-properties'],
      }
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }, {
      test: /\.styl$/,
      use: ['style-loader', 'css-loader', 'stylus-loader'], // loaders order apply from right to left
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: isProduction
    ? [
      new webpack.DefinePlugin({
        'process.env': { 'NODE_ENV': JSON.stringify('production') }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
      })
    ]
    : []
}
