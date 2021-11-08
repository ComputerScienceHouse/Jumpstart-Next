const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  var wsprox = createProxyMiddleware('/api/ws', {
    target: 'ws://localhost:8081',
    changeOrigin: true,
    ws: true
  });

  app.use(
    wsprox
  );

  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8081',
      changeOrigin: true,
    })
  );
};