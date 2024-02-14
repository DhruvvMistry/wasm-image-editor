const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: "Webpack Example App",
      header: "Webpack Example Title",
      metaDesc: "Webpack Example Description",
      template: "./src/index.html",
      filename: "index.html",
      inject: "body",
    }),
  ],
  mode: "development",
  output: {
    clean: true,
  },
  experiments: {
    asyncWebAssembly: true, // Enable async WebAssembly
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: "webassembly/async", // Set the module type for WebAssembly
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  devServer: {
    allowedHosts: [".csb.app"],
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
};
