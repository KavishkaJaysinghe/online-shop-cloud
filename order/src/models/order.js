const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  products: [{ productId: String, name: String, price: Number }],
  user: { type: String, required: true },
  totalPrice: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['created','paid','cancelled'], default: 'created' }
}, { collection: 'orders', timestamps: true });
module.exports = mongoose.model('Order', orderSchema);
