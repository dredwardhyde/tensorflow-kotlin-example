var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: [
        './src/index.js'
    ],
    output: {
        filename: '../resources/static/bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: /(src)/,
                loader: ['babel-loader', 'eslint-loader'],
                exclude: /disposables/
            },
            {
                test: /\.less$/,
                include: /(src)/,
                loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'
            },
            {
                test: /\.css$/,
                include: /(src)/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.png$/,
                loader: 'url-loader'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|gif)$/,
                loader: 'url-loader'
            }
        ]
    },
    devServer: {
        port: 7070,
        proxy: {
            '**': {
                target: 'http://localhost:9000',
                secure: false,
                changeOrigin: true
            }
        },
        publicPath: '/',
        contentBase: '../resources/static',
        hot: true
    },
    plugins: []
};

