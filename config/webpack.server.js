const path = require('path');

module.exports = {
    target: 'node',

    resolve: {
        extensions: ['', '.ts', '.js', '.json'],
        modulesDirectories: ['node_modules'],
        root: path.resolve('../src')
    },

    entry: {
        'assets/js/server.js': './src/server'
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                exclude: [/\.spec\.ts$/, path.resolve(__dirname, '../node_modules')],
                loader: 'ts'
            }
        ]
    },

    stats: {
        cached: true,
        cachedAssets: true,
        chunks: true,
        chunkModules: false,
        colors: true,
        hash: false,
        reasons: false,
        timings: true,
        version: false
    },

    externals: function checkNodeImport(context, request, cb) {
        if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
            cb(null, 'commonjs ' + request); return;
        }
        cb();
    },

    node: {
        global: true,
        __dirname: true,
        __filename: true,
        process: true,
        Buffer: true
    },

    output: {
        filename: '[name]',
        path: path.resolve(__dirname, '../target'),
        publicPath: '/'
    }
};