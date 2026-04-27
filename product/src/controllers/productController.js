const Product = require('../models/product');
const messageBroker = require('../utils/messageBroker');
const { v4: uuidv4 } = require('uuid');
class ProductController {
  constructor() { this.ordersMap = new Map(); this.consumerStarted = false; }
  async ensureConsumer() {
    if (this.consumerStarted) return;
    this.consumerStarted = true;
    await messageBroker.consumeMessage('products', (data) => {
      const order = this.ordersMap.get(data.orderId) || {};
      this.ordersMap.set(data.orderId, { ...order, ...data, status: 'completed' });
    });
  }
  async createProduct(req, res) {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (error) { res.status(400).json({ message: error.message }); }
  }
  async getProducts(req, res) {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  }
  async createOrder(req, res) {
    try {
      await this.ensureConsumer();
      const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
      if (ids.length === 0) return res.status(400).json({ message: 'At least one product id is required' });
      const products = await Product.find({ _id: { $in: ids } });
      if (products.length === 0) return res.status(404).json({ message: 'No products found' });
      const orderId = uuidv4();
      this.ordersMap.set(orderId, { orderId, status: 'pending', products, username: req.user.username });
      await messageBroker.publishMessage('orders', { orderId, productIds: products.map(p => p._id), username: req.user.username, products: products.map(p => ({ id: p._id, name: p.name, price: p.price })) });
      const start = Date.now();
      while (Date.now() - start < 15000) {
        const order = this.ordersMap.get(orderId);
        if (order.status === 'completed') return res.status(201).json(order);
        await new Promise(r => setTimeout(r, 500));
      }
      res.status(202).json({ orderId, status: 'pending', message: 'Order accepted and processing asynchronously' });
    } catch (error) { console.error(error); res.status(500).json({ message: error.message }); }
  }
  async getOrderStatus(req, res) {
    const order = this.ordersMap.get(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found in product service cache. Check order service API.' });
    res.json(order);
  }
}
module.exports = ProductController;
