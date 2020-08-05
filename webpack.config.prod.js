const path = require("path");

module.exports = {
    entry: {
      "mtag.bpmnviewer": [path.resolve(__dirname, "index.js")],
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: '[name].min.js',
      library: "bpmnViewer",
      libraryTarget: "var",
      libraryExport: "default"
    }
  }
;
