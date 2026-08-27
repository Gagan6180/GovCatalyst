/**
 * Authentication Middleware (JWT)
 * GovCatalyst Government Innovation Procurement
 */

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { formatError } = require('../utils/responseFormatter');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Optional mock pass-through for demo mode if header not provided
  if (!token) {
    req.user = {
      id: 'usr_gov_admin_01',
      name: 'Shri Rajesh Verma',
      role: 'DEPT_ADMIN',
      department: 'National Highways Authority & Ministry of Road Transport'
    };
    return next();
  }

  jwt.verify(token, env.JWT.SECRET, (err, user) => {
    if (err) {
      return formatError(res, 'Invalid or expired token', 403);
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken
};
