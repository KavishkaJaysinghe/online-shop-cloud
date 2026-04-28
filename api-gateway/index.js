const express = require("express");
const httpProxy = require("http-proxy");
const cors = require("cors");

const proxy = httpProxy.createProxyServer();
const app = express();

// 1. GLOBAL MIDDLEWARE
// Enable CORS so your UI (Frontend) can communicate with this Gateway without being blocked
app.use(cors());

// Global error handling to prevent the Gateway from crashing if any target service is down
proxy.on('error', (err, req, res) => {
    console.error('Global Proxy Error:', err);
    if (!res.headersSent) {
        res.status(502).json({
            error: "Bad Gateway",
            message: "The requested service is currently unreachable.",
            details: err.message
        });
    }
});

// 2. AUTH SERVICE ROUTE
app.use("/auth", (req, res) => {
    const oldPath = req.url;
    // Rewrite: /auth/register -> /register
    req.url = req.url.replace(/^\/auth/, '');
    
    console.log(`Proxying Auth: ${oldPath} -> http://auth-service${req.url}`);

    proxy.web(req, res, { 
        target: "http://auth-service", 
        changeOrigin: true 
    }, (err) => {
        if (!res.headersSent) {
            res.status(502).json({
                error: "Auth Service Error",
                details: err.message
            });
        }
    });
});

// 3. PRODUCT SERVICE ROUTE
app.use("/products", (req, res) => {
    const oldPath = req.url;
    // Rewrite: /products/all -> /all
    req.url = req.url.replace(/^\/products/, '');
    
    console.log(`Proxying Products: ${oldPath} -> http://product-services${req.url}`);

    proxy.web(req, res, { 
        target: "http://product-services", 
        changeOrigin: true 
    }, (err) => {
        if (!res.headersSent) {
            res.status(502).json({
                error: "Product Service Error",
                details: err.message
            });
        }
    });
});

// 4. ORDER SERVICE ROUTE
app.use("/orders", (req, res) => {
    const oldPath = req.url;
    // Rewrite: /orders/list -> /list
    req.url = req.url.replace(/^\/orders/, '');
    
    console.log(`Proxying Orders: ${oldPath} -> http://order-services${req.url}`);

    proxy.web(req, res, { 
        target: "http://order-services", 
        changeOrigin: true 
    }, (err) => {
        if (!res.headersSent) {
            res.status(502).json({
                error: "Order Service Error",
                details: err.message
            });
        }
    });
});

// 5. SERVER STARTUP
const port = process.env.PORT || 3003;
app.listen(port, () => {
    console.log(`-----------------------------------------------`);
    console.log(`API Gateway is running on port ${port}`);
    console.log(`Auth Service: http://auth-service`);
    console.log(`Product Service: http://product-services`);
    console.log(` Order Service: http://order-services`);
    console.log(`-----------------------------------------------`);
});