const server 	= require('./webpack.server');
const merge 	= require('webpack-merge');
const webpack 	= require('webpack');

const DefinePlugin = webpack.DefinePlugin;
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = merge(server, {
    devtool: 'source-map',
    plugins: [
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
});
