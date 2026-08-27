/**
 * Combined API Routes Router
 * GovCatalyst Government Innovation Procurement
 */

const express = require('express');
const router = express.Router();
const pilotRoutes = require('./pilot.routes');

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'HEALTHY', service: 'GovCatalyst Pilot Module API', timestamp: new Date().toISOString() });
});

// Mount Pilot Routes
router.use('/pilots', pilotRoutes);

module.exports = router;
