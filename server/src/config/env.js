/**
 * Environment Configuration
 * GovCatalyst Government Innovation Procurement
 */

require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: process.env.DB_PORT || 5432,
    NAME: process.env.DB_NAME || 'govcatalyst',
    USER: process.env.DB_USER || 'postgres',
    PASSWORD: process.env.DB_PASSWORD || 'postgres',
    DIALECT: 'postgres',
    LOGGING: process.env.NODE_ENV === 'development' ? false : false
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || 'govcatalyst_sih26136_super_secure_secret_key',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h'
  }
};
