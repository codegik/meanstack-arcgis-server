const server 	= require('./webpack.server');
const merge 	= require('webpack-merge');
const webpack 	= require('webpack');

const DefinePlugin = webpack.DefinePlugin;

module.exports = merge(server, {
    devtool: 'cheap-source-map',
    plugins: [
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]
});
