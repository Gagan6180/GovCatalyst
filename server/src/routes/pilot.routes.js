/**
 * SIH26136 Pilot Module - Pilot Routes (Canonical)
 * GovCatalyst Government Innovation Procurement
 */

const express = require('express');
const router = express.Router();
const pilotController = require('../controllers/pilot.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Apply authentication middleware to all pilot routes
router.use(authenticateToken);

// Pilot Endpoints
router.get('/', (req, res) => pilotController.getAllPilots(req, res));
router.post('/', (req, res) => pilotController.createPilot(req, res));
router.get('/:id', (req, res) => pilotController.getPilotById(req, res));
router.patch('/:id/status', (req, res) => pilotController.updateStatus(req, res));
router.get('/:id/evaluate', (req, res) => pilotController.evaluatePilot(req, res));
router.get('/:id/report', (req, res) => pilotController.getCompletionReport(req, res));

module.exports = router;
