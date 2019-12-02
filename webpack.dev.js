const path = require("path");

const merge = require("webpack-merge");
const config = require("./webpack.common");

const dev = {
    mode: "development",
    devServer: {
        compress: true,
        port: 9000
    }
};

module.exports = merge(config, dev);