const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3003;

const AUTH_URL = process.env.AUTH_URL || 'http://auth:3000';
const PRODUCT_URL = process.env.PRODUCT_URL || 'http://product:3001';
const ORDER_URL = process.env.ORDER_URL || 'http://order:3002';

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => res.json({ service: 'api-gateway', status: 'ok' }));

app.use('/auth', createProxyMiddleware({ target: AUTH_URL, changeOrigin: true, pathRewrite: { '^/auth': '' } }));
app.use('/products', createProxyMiddleware({ target: PRODUCT_URL, changeOrigin: true, pathRewrite: { '^/products': '/api/products' } }));
app.use('/orders', createProxyMiddleware({ target: ORDER_URL, changeOrigin: true, pathRewrite: { '^/orders': '/api/orders' } }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(502).json({ message: 'Gateway error', detail: err.message });
});

app.listen(port, () => console.log(`API Gateway listening on port ${port}`));
