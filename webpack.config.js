const webpack = require('webpack')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  entry: './sidebarleft.jsx',
  output: {
    libraryTarget: 'var',
    library: 'sidebarLeft',
    path: './dist',
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
    //   test: /\.png$/,
    //   use: 'url-loader',
    //   // use: 'url-loader?mimetype=image/png&limit=100000',
    //   options: {
    //     mimetype: 'image/png',
    //     limit: 100000
    //   }
    // }, {
    //   test: [
    //     /\.jpg$/,
    //     /\.gif$/,
    //     /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    //     /\.ico(\?v=\d+\.\d+\.\d+)?$/
    //   ],
    //   use: 'file-loader'
    // }, {
    //   test: [
    //     /\.woff(\?v=\d+\.\d+\.\d+)?$/,
    //     /\.woff2(\?v=\d+\.\d+\.\d+)?$/
    //   ],
    //   use: 'url-loader',
    //   // use: 'url-loader?limit=10000&mimetype=application/font-woff',
    //   options: {
    //     mimetype: 'application/font-woff',
    //     limit: 100000
    //   }
    // }, {
    //   test: [/\.ttf(\?v=\d+\.\d+\.\d+)?$/],
    //   use: 'url-loader',
    //   // use: 'url-loader?limit=10000&mimetype=application/octet-stream',
    //   options: {
    //     mimetype: 'application/octet-stream',
    //     limit: 100000
    //   }
    // }, {
    //   test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    //   use: 'url-loader',
    //   // use: 'url-loader?limit=10000&mimetype=image/svg+xml',
    //   options: {
    //     mimetype: 'image/svg+xml',
    //     limit: 100000
    //   }
    // }]
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
