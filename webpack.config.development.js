const { merge } = require("webpack-merge");
const path = require("path");

const config = require("./webpack.config");

module.exports = merge(config, {
  mode: "development",

  devtool: "inline-source-map",

  //   * https://stackoverflow.com/questions/71048875/webpack-invalid-options-object-when-using-writetodisk
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
  },

  output: {
    // * 创建文件路径
    path: path.resolve(__dirname, "public"),
  },
});
