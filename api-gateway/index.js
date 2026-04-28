const express = require("express");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer();
const app = express();

// Error handling to prevent the gateway from crashing if a service is unreachable
proxy.on('error', (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(502).send('Bad Gateway: Service unreachable');
});

// Route requests to the Auth Service
// Route requests to the Auth Service
app.use("/auth", (req, res) => {
    // 1. Path rewrite: Changes /auth/register to /register
    const oldPath = req.url;
    req.url = req.url.replace(/^\/auth/, '');
    
    // Debugging log: Visible in Azure Log Stream to verify the path transformation
    console.log(`Proxying request from ${oldPath} to http://auth-service${req.url}`);

    // 2. Forward the request to the target container
    proxy.web(req, res, { 
        target: "http://auth-service",
        changeOrigin: true // Recommended for Azure to ensure Host headers match the target
    }, (err) => {
        // 3. Error handling: Triggered if the Auth Service is unreachable
        console.error("Proxy Error (Auth Service):", err);
        
        if (!res.headersSent) {
            res.status(502).json({
                error: "Bad Gateway",
                message: "Unable to connect to the Auth Service. Please ensure the service is running and the Ingress Target Port is correct.",
                details: err.message
            });
        }
    });
});

// Route requests to the Product Service changes
app.use("/products", (req, res) => {
    req.url = req.url.replace(/^\//, '');
    proxy.web(req, res, { target: "http://product-services" });
});

// Route requests to the Order Service
app.use("/orders", (req, res) => {
    req.url = req.url.replace(/^\//, '');
    proxy.web(req, res, { target: "http://order-services" });
});

// Use port 3003 (matching your local/compose setup)
const port = process.env.PORT || 3003;
app.listen(port, () => {
    console.log(`API Gateway listening on port ${port}`);
});