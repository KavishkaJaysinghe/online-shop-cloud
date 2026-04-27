const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const authMiddleware = require('./middlewares/authMiddleware');
const AuthController = require('./controllers/authController');

class App {
  constructor() {
    this.app = express();
    this.authController = new AuthController();
    this.connectDB();
    this.setMiddlewares();
    this.setRoutes();
  }
  async connectDB() {
    await mongoose.connect(config.mongoURI);
    console.log('Auth MongoDB connected');
  }
  setMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(rateLimit({ windowMs: 60 * 1000, max: 80 }));
    this.app.use(express.json({ limit: '100kb' }));
  }
  setRoutes() {
    this.app.get('/health', (req, res) => res.json({ service: 'auth', status: 'ok' }));
    this.app.post('/login', (req, res) => this.authController.login(req, res));
    this.app.post('/register', (req, res) => this.authController.register(req, res));
    this.app.get('/profile', authMiddleware, (req, res) => this.authController.getProfile(req, res));
  }
  start() { this.server = this.app.listen(process.env.PORT || 3000, () => console.log('Auth service started')); }
  async stop() { await mongoose.disconnect(); this.server?.close(); }
}
module.exports = App;
