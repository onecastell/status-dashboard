const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html',
            inlineSource: '.(js|.css)$'
        }),
        new HtmlWebpackInlineSourcePlugin()
    ]
}