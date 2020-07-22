const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    bundle: [__dirname + "/index.js"],
  },
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "index.html"),
        },
        {
          from: path.resolve(__dirname, "diagram.txt"),
        },
      ],
    }),
  ],
  devtool: "source-map",
};
