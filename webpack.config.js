const webpack = require('webpack')
const isProduction = process.env.NODE_ENV === "production"

module.exports = {
  entry: './sidebarleft.jsx',
  output: {
    path: '/dist',
    filename: 'sidebarleft.js',
  },
  watch: isProduction ? false : true,
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

// preLoaders: [
//       {
//         test: /\.jsx?$/,
//         loader: 'standard',
//         exclude: [/node_modules/, /\/app\/lib\/FileSaver\.js/]
//       }
//     ],
//     loaders: [
//       {
//         test: [/\.js$/, /\.jsx$/],
//         include: [/\/app/],
//         loader: 'babel-loader',
//         query: {
//           presets: ['react', 'es2015'],
//           // plugins: ['transform-object-rest-spread', 'transform-class-properties'],
//         }
//       }, {
//         test: /\.css$/,
//         loader: 'style-loader!css-loader',
//       }, {
//         test: /\.styl$/,
//         loader: 'style-loader!css-loader!stylus-loader', // loaders order apply from right to left
//       }, {
//         test: /\.json$/,
//         loader: 'json-loader',
//       }, {
//         test: /\.png$/,
//         loader: 'url-loader?mimetype=image/png&limit=100000',
//       }, {
//         test: /\.jpg$/,
//         loader: 'file-loader',
//       },{
//         test: /\.gif$/,
//         loader: 'file-loader',
//       }, {
//         test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
//         loader: 'url-loader?limit=10000&mimetype=application/font-woff',
//       }, {
//         test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
//         loader: 'url-loader?limit=10000&mimetype=application/font-woff',
//       }, {
//         test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
//         loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
//       }, {
//         test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
//         loader: 'file-loader',
//       }, {
//         test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
//         loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
//       }, {
//         test: /\.ico(\?v=\d+\.\d+\.\d+)?$/,
//         loader: 'file-loader',
//       }
//     ]
