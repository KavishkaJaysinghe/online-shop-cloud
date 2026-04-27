const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/userRepository');
const config = require('../config');
class AuthService {
  constructor() { this.userRepository = new UserRepository(); }
  async login(username, password) {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) return { success: false, message: 'Invalid username or password' };
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { success: false, message: 'Invalid username or password' };
    const payload = { id: user._id.toString(), username: user.username };
    return { success: true, token: jwt.sign(payload, config.jwtSecret, { expiresIn: '2h' }), user: { id: payload.id, username: payload.username } };
  }
  async register(user) {
    const existingUser = await this.userRepository.getUserByUsername(user.username);
    if (existingUser) throw new Error('Username already taken');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const saved = await this.userRepository.createUser(user);
    return { id: saved._id, username: saved.username };
  }
}
module.exports = AuthService;
