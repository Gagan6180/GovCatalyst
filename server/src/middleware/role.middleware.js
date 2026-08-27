/**
 * Role-Based Access Control (RBAC) Middleware
 * GovCatalyst Government Innovation Procurement
 */

const { formatError } = require('../utils/responseFormatter');

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return formatError(res, 'Access denied: user role not identified', 403);
    }

    const hasRole = allowedRoles.includes(req.user.role) || req.user.role === 'SUPER_ADMIN' || req.user.role === 'DEPT_ADMIN';
    if (!hasRole) {
      return formatError(res, `Access denied: requires one of [${allowedRoles.join(', ')}]`, 403);
    }

    next();
  };
};

module.exports = {
  authorizeRoles
};
