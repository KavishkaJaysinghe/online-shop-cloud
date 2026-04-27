const jwt = require('jsonwebtoken');
const config = require('../config');
module.exports = function(req, res, next) {
  const auth = req.headers.authorization || req.header('x-auth-token');
  const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try { req.user = jwt.verify(token, config.jwtSecret); next(); }
  catch { res.status(401).json({ message: 'Token is not valid' }); }
};
