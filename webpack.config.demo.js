const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    bundle: [path.resolve(__dirname, "index.js")],
  },
  output: {
    path: path.resolve(__dirname, "demo"),
    filename: "bundle.js",
    library: "bpmnViewer",
    libraryTarget: "var",
    libraryExport: "default",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "demo.html"),
          to: "./index.html",
        },
        {
          from: path.resolve(__dirname, "diagram.txt"),
        },
        {
          from: path.resolve(__dirname, "shipment_processes.txt"),
        },
        {
          from: path.resolve(__dirname, "test1.bpmn"),
        },
        {
          from: path.resolve(__dirname, "test2.bpmn"),
        },
      ],
    }),
  ],
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "demo"),
    compress: true,
    port: 8084,
  },
};
