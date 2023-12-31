const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: path.resolve(__dirname, './src/index.ts'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index.bundle.js',
        // assetModuleFilename: 'dist/images/[hash][ext][query]'
        assetModuleFilename: '[name][ext]'
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,

            },
            {
                // test: /\.(png|svg|jpg|jpeg|gif)$/,
                test: /\.png/,
                type: 'asset/resource',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 3000,
        liveReload: true,
        client: {
            webSocketURL: 'auto://0.0.0.0:0/proxy/3000/ws', // note the `:0` after `0.0.0.0`
        },
        allowedHosts: 'all',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin(),
    ],
    mode: 'development',
}