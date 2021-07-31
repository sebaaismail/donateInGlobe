"use strict";

const { resolve } = require("path");

const Uglify = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: "./app/main.jsx",
  output: {
    path: __dirname,
    filename: "./public/bundle.js",
  },
  plugins: [new Uglify()],
  context: __dirname,
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    loaders: [
      {
        test: /jsx?$/,
        include: resolve(__dirname, "./app"),
        loader: "babel-loader",
        query: {
          presets: ["react", "es2015"],
        },
      },
    ],
  },
};
