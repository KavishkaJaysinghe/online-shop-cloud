const amqp = require('amqplib');
class MessageBroker {
  constructor() { this.channel = null; this.connection = null; }
  async connect(retries = 20) {
    const url = process.env.RABBITMQ_URL || process.env.RABBITMQ_URI || 'amqp://rabbitmq:5672';
    for (let i = 1; i <= retries; i++) {
      try {
        this.connection = await amqp.connect(url);
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue('orders', { durable: true });
        await this.channel.assertQueue('products', { durable: true });
        console.log('Product service connected to RabbitMQ');
        return;
      } catch (err) {
        console.log(`RabbitMQ not ready (${i}/${retries}): ${err.message}`);
        await new Promise(r => setTimeout(r, 3000));
      }
    }
  }
  async publishMessage(queue, message) {
    if (!this.channel) throw new Error('RabbitMQ channel unavailable');
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  }
  async consumeMessage(queue, callback) {
    if (!this.channel) throw new Error('RabbitMQ channel unavailable');
    await this.channel.consume(queue, msg => {
      if (!msg) return;
      callback(JSON.parse(msg.content.toString()));
      this.channel.ack(msg);
    });
  }
}
module.exports = new MessageBroker();
