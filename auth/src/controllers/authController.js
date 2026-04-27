const AuthService = require('../services/authService');
class AuthController {
  constructor() { this.authService = new AuthService(); }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ message: 'username and password are required' });
      const result = await this.authService.login(username, password);
      if (!result.success) return res.status(401).json({ message: result.message });
      res.json({ token: result.token, user: result.user });
    } catch (err) { res.status(500).json({ message: 'Login failed' }); }
  }
  async register(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password || password.length < 6) return res.status(400).json({ message: 'username and password with at least 6 characters are required' });
      const result = await this.authService.register({ username, password });
      res.status(201).json(result);
    } catch (err) { res.status(400).json({ message: err.message }); }
  }
  async getProfile(req, res) { res.json({ user: req.user }); }
}
module.exports = AuthController;
