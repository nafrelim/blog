const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
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
        new HtmlWebpackPlugin({ template: "./public/index.html" }),
        new webpack.DefinePlugin({
          "process.env.BLOG_API_URL": JSON.stringify(process.env.BLOG_API_URL || "http://localhost:8000"),
        }),
    ],
  mode: "development",
  devtool: "source-map",
  devServer: {
    // static: {
    //   // directory: path.join(__dirname, `${entryPath}`),
    //   publicPath: "/",
    // },
    compress: true,
    host: "0.0.0.0",
    port: process.env.PORT || 8080,
    allowedHosts: [
      // '.heroku.com',
      //'nafrelim-blog.herokuapp.com',
      'localhost',
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
