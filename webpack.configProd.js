const path = require('path');

const config = {
    mode: 'production', // or 'development' if you are in development mode
    entry: {
        index: './src/js/index.js'
        // contacts: './src/js/contacts.js',
        // about: './src/js/about.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['transform-remove-console']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};

module.exports = config;