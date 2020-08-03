const path = require("path");

module.exports = {
  entry: {
    bundle: [path.resolve(__dirname, "index.js")],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    library: "bpmnViewer",
    libraryTarget: "var",
    libraryExport: "default"
  },
  devtool: "source-map",
};
