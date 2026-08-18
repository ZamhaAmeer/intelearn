const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');

  // Check if no header or token
  if (!authHeader) {
    return res.status(401).json({ error: 'No token, authorization denied.' });
  }

  // The header should be formatted as "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token format invalid. Use Bearer <token>' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'intelearn_secret_key_2026');
    req.user = decoded; // Attach admin user details { id, username, role }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid or has expired.' });
  }
};
