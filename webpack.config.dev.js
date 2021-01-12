const path = require("path");

module.exports = { 
  mode: "development",
  output: {
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
