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

// --- PRODUCT SERVICE ---
app.use("/products", (req, res) => {
    // Strips '/products' from the incoming URL
    req.url = req.url.replace(/^\/products/, ''); 
    console.log(`Proxying Products: ${req.url}`);
    
    // Ensure "product-service" matches your Azure Container App name
    proxy.web(req, res, { target: "http://product-service", changeOrigin: true });
});

// --- ORDER SERVICE ---
app.use("/orders", (req, res) => {
    // Strips '/orders' from the incoming URL
    req.url = req.url.replace(/^\/orders/, '');
    console.log(`Proxying Orders: ${req.url}`);
    
    // Ensure "order-service" matches your Azure Container App name
    proxy.web(req, res, { target: "http://order-service", changeOrigin: true });
});

// Use port 3003 (matching your local/compose setup)
const port = process.env.PORT || 3003;
app.listen(port, () => {
    console.log(`API Gateway listening on port ${port}`);
});