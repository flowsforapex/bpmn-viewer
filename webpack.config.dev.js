const path = require("path");

module.exports = { 
  entry: {
    "mtag.bpmnviewer": [path.resolve(__dirname, "index.js")],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].js',
    library: "bpmnViewer",
    libraryTarget: "var",
    libraryExport: "default",
  },
  optimization: {
    minimize: false
  },
  devtool: "source-map",
}
;
