const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        createProxyMiddleware('/auth', {
            target: 'http://localhost:9999',
            changeOrigin: true,
        }),
        createProxyMiddleware('/api', {
            target: 'http://localhost:8080',
            changeOrigin: true,
        }),
    );
};