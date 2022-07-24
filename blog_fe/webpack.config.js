const path = require("path");
const entryPath = "src"
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = {
  // entry: ['whatwg-fetch', `./${entryPath}/js/app.js`],
  entry: `./${entryPath}/App.js`,

  output: {
    filename: "out.js",
    path: path.resolve(__dirname, `${entryPath}/build`),
    clean: true,
  },
  plugins: [
        new CaseSensitivePathsPlugin(),
    ],
  mode: "development",
  devtool: "source-map",
  devServer: {
    // static: {
    //   // directory: path.join(__dirname, `${entryPath}`),
    //   publicPath: "/",
    // },
    compress: true,
    port: process.env.PORT || 8080,
    allowedHosts: [
      '.heroku.com',
      'nafrelim-blog-fe.herokuapp.com',
    ],
    historyApiFallback: true,
    hot: true,

  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
};
