const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
module.exports = {
    entry: './src/renderer.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    module: {
        rules: [

            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },

            {
                test: /\.jsx$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },

            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]', // Resmin adı ve yolu korunur
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/public/index.html',
        }),
        new MonacoWebpackPlugin({
            languages: ["javascript", "typescript", "json", "html", "css"],
        }),
    ],
    devServer: {
        static: './dist',
    },
};

