module.exports = {
    publicPath: '',
    devServer: {
        // proxy: {
        //     '/': {
        //         target: 'http://localhost:3000',
        //         changeOrigin: true,
        //         ws: true
        //     }
        // }
    },
    chainWebpack: config => {
        config.optimization.delete('splitChunks')
    }
}
