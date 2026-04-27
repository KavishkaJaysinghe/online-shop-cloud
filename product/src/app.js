const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const MessageBroker = require('./utils/messageBroker');
const productsRouter = require('./routes/productRoutes');
class App {
  constructor() { this.app = express(); this.connectDB(); this.setMiddlewares(); this.setRoutes(); this.setupMessageBroker(); }
  async connectDB() { await mongoose.connect(config.mongoURI); console.log('Product MongoDB connected'); }
  setMiddlewares() { this.app.use(helmet()); this.app.use(cors()); this.app.use(rateLimit({ windowMs: 60000, max: 100 })); this.app.use(express.json({ limit: '100kb' })); }
  setRoutes() { this.app.get('/health', (req,res)=>res.json({service:'product',status:'ok'})); this.app.use('/api/products', productsRouter); }
  setupMessageBroker() { MessageBroker.connect(); }
  start() { this.server = this.app.listen(config.port, () => console.log(`Product service started on ${config.port}`)); }
}
module.exports = App;
