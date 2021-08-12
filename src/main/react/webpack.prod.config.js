var webpack = require('webpack');

var webpackConfig = require('./webpack.config.js');
var CompressionPlugin = require('compression-webpack-plugin');

module.exports = Object.assign({}, webpackConfig, {
    plugins: webpackConfig.plugins.concat([
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
        new webpack.optimize.AggressiveMergingPlugin()
    ])
});
