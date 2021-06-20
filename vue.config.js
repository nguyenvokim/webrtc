module.exports = {
    publicPath: '',
    devServer: {
        proxy: {
            '/': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                ws: true
            }
        }
    },
    chainWebpack: config => {
        config.optimization.delete('splitChunks')
    }
}
