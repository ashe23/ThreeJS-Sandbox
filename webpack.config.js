const path = require('path');
const nodeModulesPath = path.join(__dirname, 'node_modules');



module.exports = {
    entry: './public/test.js',
    resolve: {
        modules: ['node_modules']
    },
    output: {
        path: path.resolve(__dirname, './public/dist'),
        filename: 'bundle.js'
    },   
    watch: true
};