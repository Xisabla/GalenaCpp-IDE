const path = require('path');
const WebpackBar = require('webpackbar');

module.exports = {
  entry: {
    app: [path.resolve(__dirname, "./src", "./index.js")]
  },
  output: {
    path: `${__dirname}/dist/`,
    filename: "bundle.js",
    publicPath: "/dist/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "eslint-loader",
        enforce: "pre",
        include: [path.resolve(__dirname, "/src")],
        options: {
          fix: true,
          emitWarning: true
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new WebpackBar({
      name: "app",
      basic: true
    })
  ],
  resolve: {
    alias: {
      jquery: "jquery/src/jquery"
    }
  }
};