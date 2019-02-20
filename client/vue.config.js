 module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(pdf)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                name: 'files/[name].[hash:8].[ext]'
              }
            }
          ]
        }
      ]
    }
  },
  devServer: {
    proxy: { // proxyTable 설정
      '/api' : {
          target : 'http://localhost:3000/api',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
      }
    }
  }
}