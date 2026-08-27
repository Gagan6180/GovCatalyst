/**
 * Standardized Response Formatter
 * GovCatalyst Government Innovation Procurement
 */

const formatSuccess = (res, data = null, message = 'Operation successful', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const formatError = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  formatSuccess,
  formatError
};
