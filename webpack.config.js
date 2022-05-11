var ExtractTextPlugin = require('extract-text-webpack-plugin'),
webpack = require('webpack');
// dotenv = require('dotenv'),
// dotenvParseVariables = require('dotenv-parse-variables');

var env = require('dotenv').config({path: '.env'}),
parsedEnv = env.parsed;
// parsedEnv = dotenvParseVariables(env.parsed);

var rfr = require('rfr');
var config = rfr('/server/shared/config');

module.exports = {
  context: __dirname + '/client/src',
  entry: ['./index.jsx', './assets/styles/index.scss'],
  output: {
    filename: 'bundle.js',
    path: __dirname + '/client/dist'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      { // regular css files
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          use: 'css-loader?importLoaders=1'
        }),
      },
      { // sass/scss loader for webpack
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.(jpe?g|png|gif|ttf|eot|svg|woff2?)$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 40000 }
          }
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({ // define where to save the file
      filename: 'bundle.css',
      allChunks: true,
    }),
    new webpack.DefinePlugin({
      '_API_ENDPOINT_': '"' + parsedEnv.API_ENDPOINT + '"',
      '_SHOW_CLIENT_ERROR_': parsedEnv.SHOW_CLIENT_ERROR,
      '_SHOW_CLIENT_WARN_': parsedEnv.SHOW_CLIENT_WARN,
      '_SHOW_CLIENT_LOG_': parsedEnv.SHOW_CLIENT_LOG,
      '_CAPTCHA_SITE_KEY_': '"' + parsedEnv.CAPTCHA_SITE_KEY + '"',
      '_S3_BUCKET_URL_': '"' + config.bucketUrl + '"',
      '_ENV_': '"' + parsedEnv.ENV + '"',
      '_STRIPE_CLIENT_ID_': '"' + parsedEnv.STRIPE_CLIENT_ID + '"',
    })
  ]
};
