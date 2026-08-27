const express = require('express');
const router = express.Router();
const {
  createChallenge,
  listChallenges,
  getChallenge,
  getMyChallenges,
  updateChallenge,
  publishChallenge,
} = require('../controllers/challengeController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.post('/', authenticate, requireRole('dept_admin'), createChallenge);
router.get('/', authenticate, listChallenges);                 // all logged-in roles can browse
router.get('/my', authenticate, requireRole('dept_admin'), getMyChallenges);
router.get('/:id', authenticate, getChallenge);
router.patch('/:id', authenticate, requireRole('dept_admin'), updateChallenge);
router.patch('/:id/publish', authenticate, requireRole('dept_admin'), publishChallenge);

module.exports = router;