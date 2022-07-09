const path = require("path");
const { merge } = require("webpack-merge");

const {
  CleanWebpackPlugin,
} = require("clean-webpack-plugin");

const config = require("./webpack.config");

// * merge可以把另一个文件的代码merge到这里来，conflict free
module.exports = merge(config, {
  mode: "production",

  output: {
    path: path.join(__dirname, "public"),
  },

  //  * 每次build 清空缓存中的plugins
  plugins: [new CleanWebpackPlugin()],
});
