const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
    configureWebpack: {
        devtool: 'source-map',
        output: {
            libraryExport: 'default',
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: path.join(__dirname, 'src/link-prevue.css'),
                    to: path.join(__dirname, 'dist/link-prevue.css'),
                },
            ]),
        ],
    },
    css: { extract: true }
}