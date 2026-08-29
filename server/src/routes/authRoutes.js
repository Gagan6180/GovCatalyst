const express = require('express');
const router = express.Router();
const { register, login, getMe, getPendingUsers, approveUser, rejectUser, verifyOtp } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.get('/pending-users', getPendingUsers);
router.post('/approve/:id', approveUser);
router.post('/reject/:id', rejectUser);
router.post('/verify-otp', verifyOtp);

module.exports = router;