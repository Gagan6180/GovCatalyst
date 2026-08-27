<<<<<<< HEAD
require("dotenv").config();
const express = require("express");
require("./config/db");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic Route
app.get("/", (req, res) => {
    res.send("Server is running!");
});

//api-routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on  http://localhost:${port}`);
});
=======
/**
 * GovCatalyst Server Application Bootstrap
 * SIH26136 Startup-Friendly Government Innovation Procurement
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler.middleware');
const env = require('./config/env');

const app = express();

// Security and Logging Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API v1 Routes
app.use('/api/v1', routes);

// Base / Root Route
app.get('/', (req, res) => {
  res.json({
    name: 'GovCatalyst API',
    description: 'SIH26136 Startup-Friendly Government Innovation Procurement Platform',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      pilots: '/api/v1/pilots'
    },
    status: 'ACTIVE'
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// If run directly, start server
if (require.main === module) {
  const PORT = env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[GOVCATALYST SERVER] Running on port ${PORT} in ${env.NODE_ENV} mode.`);
    console.log(`[API ENDPOINTS] Base URL: http://localhost:${PORT}/api/v1`);
  });
}
>>>>>>> 7b555a4 (feat: add government innovation pilot module)

module.exports = app;
