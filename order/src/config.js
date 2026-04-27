require('dotenv').config();
module.exports = { mongoURI: process.env.MONGODB_ORDER_URI || 'mongodb://mongo-order:27017/orders', rabbitMQURI: process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672', port: process.env.PORT || 3002 };
