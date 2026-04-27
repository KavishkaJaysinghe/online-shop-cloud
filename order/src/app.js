const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const Order = require('./models/order');
const amqp = require('amqplib');
const config = require('./config');
const isAuthenticated = require('./utils/isAuthenticated');
class App {
  constructor() { this.app = express(); this.connectDB(); this.setMiddlewares(); this.setRoutes(); this.setupOrderConsumer(); }
  async connectDB() { await mongoose.connect(config.mongoURI); console.log('Order MongoDB connected'); }
  setMiddlewares() { this.app.use(helmet()); this.app.use(cors()); this.app.use(rateLimit({ windowMs: 60000, max: 100 })); this.app.use(express.json({ limit: '100kb' })); }
  setRoutes() {
    this.app.get('/health', (req,res)=>res.json({service:'order', status:'ok'}));
    this.app.get('/api/orders', isAuthenticated, async (req,res)=>res.json(await Order.find({ user: req.user.username }).sort({createdAt:-1})));
    this.app.get('/api/orders/:orderId', isAuthenticated, async (req,res)=>{
      const order = await Order.findOne({ orderId: req.params.orderId, user: req.user.username });
      if (!order) return res.status(404).json({message:'Order not found'});
      res.json(order);
    });
  }
  async setupOrderConsumer(retries = 20) {
    const url = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
    for (let i=1; i<=retries; i++) {
      try {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();
        await channel.assertQueue('orders', { durable: true });
        await channel.assertQueue('products', { durable: true });
        console.log('Order service connected to RabbitMQ');
        channel.consume('orders', async (data) => {
          if (!data) return;
          try {
            const { products, username, orderId } = JSON.parse(data.content.toString());
            const order = await Order.create({ orderId, user: username, products: products.map(p => ({ productId: p.id || p._id, name: p.name, price: p.price })), totalPrice: products.reduce((sum,p)=>sum+Number(p.price||0),0), status: 'created' });
            channel.ack(data);
            channel.sendToQueue('products', Buffer.from(JSON.stringify({ orderId, user: username, products: order.products, totalPrice: order.totalPrice, status: 'completed' })), { persistent: true });
          } catch (err) { console.error(err); channel.nack(data, false, false); }
        });
        return;
      } catch (err) { console.log(`RabbitMQ not ready (${i}/${retries}): ${err.message}`); await new Promise(r=>setTimeout(r,3000)); }
    }
  }
  start() { this.server = this.app.listen(config.port, () => console.log(`Order service started on ${config.port}`)); }
}
module.exports = App;
