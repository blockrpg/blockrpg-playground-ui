const webpack = require("webpack");

module.exports = {
  devServer: {
    open: true,
    proxy: {
      '/api/login': {
        target: 'http://localhost:3001/',
        changeOrigin: true,
        secure: false,
      },
      '/api/map': {
        target: 'http://localhost:3002/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
