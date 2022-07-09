const path = require("path");
const webpack = require("webpack");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const IS_DEVELOPMENT = process.env.NODE_ENV === "dev";

// * 拼接文件名
const dirApp = path.join(__dirname, "app");
const dirShared = path.join(__dirname, "shared");
const dirStyles = path.join(__dirname, "styles");

module.exports = {
  entry: [
    path.join(dirApp, "index.js"),
    path.join(dirStyles, "index.scss"),
  ],

  //   * https://webpack.wuhaolin.cn/2%E9%85%8D%E7%BD%AE/2-4Resolve.html
  resolve: {
    modules: [dirApp, dirShared, dirStyles, "node_modules"],
  },

  plugins: [
    // * define了一个常量全局可用
    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
    }),

    // * will copy all the files from the from path to the output folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./shared",
          to: "",
        },
      ],
    }),

    // * 重新定义css chunk文件名
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),

    // * 优化图片大小
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
          // Lossless optimization with custom option
          // Feel free to experiment with options for better result for you
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
          ],
        },
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader?cacheDirectory"],
        include: path.resolve(__dirname, "app"),
      },

      {
        // 命中 SCSS 文件
        test: /\.scss$/,
        // 使用一组 Loader 去处理 SCSS 文件。
        // 处理顺序为从后到前，即先交给 sass-loader 处理，再把结果交给 css-loader 最后再给 style-loader。
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "",
            },
          },
          {
            loader: "css-loader",
          },
          {
            // * 添加一些prefix 以便全部浏览器适配
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
        // 排除 node_modules 目录下的文件
        exclude: path.resolve(__dirname, "node_modules"),
      },

      {
        // 对非文本文件采用 file-loader 加载
        test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf|webp)$/,
        loader: "file-loader",
        options: {
          // * build 环境下·的output文件格式
          name(file) {
            return "[hash].[ext]";
          },
        },
      },

      //   * glsl loader
      {
        test: /\.(glsl|frag|vert)$/,
        loader: "raw-loader",
        exclude: /node_modules/,
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: "glslify-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
