const merge = require("webpack-merge");

const {
    app,
    client
} = require("./webpack.common");

const dev = {
    mode: "production"
};

const devApp = merge(app, dev);
const devClient = merge(client, dev);

module.exports = [devApp, devClient];