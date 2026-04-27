const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports = function isAuthenticated(req, res, next) {
  const auth = req.headers.authorization;
  const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret'); next(); }
  catch { return res.status(401).json({ message: 'Unauthorized' }); }
};
