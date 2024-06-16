const path = require("path");

module.exports = {
  entry: {
    popup: "./src/popup/index.js",
    dashboard: "./src/dashboard/index.js", // New entry point for the dashboard
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
