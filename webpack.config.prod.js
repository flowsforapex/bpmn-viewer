const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    "mtag.bpmnviewer": [path.resolve(__dirname, "src/index.js")],
  },
  output: {
    filename: '[name].min.js',
    library: "bpmnViewer",
    libraryTarget: "var",
    libraryExport: "default"
  }
}
  ;
