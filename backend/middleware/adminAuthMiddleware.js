const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// Authenticate administrator by validating JWT and checking verification status in database
const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'No token, authorization denied.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token format invalid. Use Bearer <token>' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'intelearn_secret_key_2026');
    
    // Validate current record in PostgreSQL (ensures status updates like verification are checked)
    const result = await db.query(
      'SELECT id, username, email, role, is_verified FROM admin_users WHERE id = $1', 
      [decoded.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Admin account does not exist or has been disabled.' });
    }

    const admin = result.rows[0];

    if (!admin.is_verified) {
      return res.status(403).json({ error: 'Please verify your email address before accessing the portal.' });
    }

    req.user = admin;
    next();
  } catch (error) {
    console.error('Admin authentication failure:', error.message);
    res.status(401).json({ error: 'Session expired or token invalid. Please sign in again.' });
  }
};

// Assert admin privileges (requires user.role to be 'admin')
const requireAdminRole = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};

module.exports = {
  authenticateAdmin,
  requireAdminRole
};
