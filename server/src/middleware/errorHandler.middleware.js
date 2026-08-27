/**
 * Centralized Error Handling Middleware
 * GovCatalyst Government Innovation Procurement
 */

const { formatError } = require('../utils/responseFormatter');

const errorHandler = (err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack || err.message || err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errors = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  return formatError(res, message, statusCode, errors);
};

module.exports = errorHandler;
