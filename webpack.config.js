const dotenv = require('dotenv');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const env = dotenv.config().parsed;


const definePluginEnv = Object.keys(env).reduce((acc, key) => {
    acc[`process.env.${key}`] = JSON.stringify(env[key]);
    return acc;
}, {});

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
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                type: 'asset/resource',
            },
        ],

    },
    resolve: {
        extensions: ['.js', '.jsx', '.css'],
        fallback: {
            path: require.resolve('path-browserify')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/public/index.html',
        }),
        new MonacoWebpackPlugin({
            languages: ["javascript", "typescript", "json", "html", "css",
                "python"],
        }),
    ],
    devServer: {
        static: './dist',
    },
};

