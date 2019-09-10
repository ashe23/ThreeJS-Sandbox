const path = require('path');
const outputDir = path.resolve(__dirname, 'public/build');
const env = process.env.NODE_ENV || 'development';

module.exports = {
    mode: env,
    entry: [path.resolve(__dirname, 'public/src')],
    output: {
        path: outputDir,
        filename: 'bundle.js'
    },
    watch: true,
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: [
                    'raw-loader',
                    'glslify-loader'
                ]
            }
        ]
    }
};