const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        proxy('/auth', {
            target: 'http://localhost:9999',
            changeOrigin: true,
        }),
        proxy('/api', {
            target: 'http://localhost:8080',
            changeOrigin: true,
        }),
    );
};