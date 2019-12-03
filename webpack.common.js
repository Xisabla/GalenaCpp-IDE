const path = require("path");
const merge = require("webpack-merge");
const WebpackBar = require("webpackbar");

const shared = {
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
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "src/images/[name].[ext]"
            }
          }
        ]
      }
    ]
  }
};

const app = {
    entry: {
        main: ["./src/app/index.js"]
    },
    output: {
        path: `${__dirname}/dist/app`,
        filename: "index.js",
        publicPath: "./"
    },
    target: "electron-main",
    plugins: [
        new WebpackBar({
            name: "app",
            color: "yellow",
            basic: true
        })
    ]
};

const client = {
    entry: {
            main: ["./src/client/index.js"]
        },
        resolve: {
          alias: {
            jquery: "jquery/src/jquery"
          }
        },
        output: {
            path: `${__dirname}/dist/client`,
            filename: "bundle.js",
            publicPath: "./"
        },
        target: "electron-renderer",
        plugins: [
            // HtmlWebpackPlugin
            /*new MiniCssExtractPlugin({
              filename: '[name].css',
              chunkFilename: '[id].css'
            }),*/
            new WebpackBar({
                name: "client",
                basic: true
            })
        ]
}

module.exports = {
    app: merge(app, shared),
    client: merge(client, shared)
};
