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
app.use("/auth", (req, res) => {
    // 'auth-service' must match the name you gave the Container App in Azure
    proxy.web(req, res, { target: "http://auth-service" });
});

// Route requests to the Product Service
app.use("/products", (req, res) => {
    proxy.web(req, res, { target: "http://product-services" });
});

// Route requests to the Order Service
app.use("/orders", (req, res) => {
    proxy.web(req, res, { target: "http://order-services" });
});

// Use port 3003 (matching your local/compose setup)
const port = process.env.PORT || 3003;
app.listen(port, () => {
    console.log(`API Gateway listening on port ${port}`);
});