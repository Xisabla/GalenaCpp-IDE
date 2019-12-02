const merge = require("webpack-merge");
const config = require("./webpack.common");

const prod = {
    mode: "production"
};

module.exports = merge(config, prod);