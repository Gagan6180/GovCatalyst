const { hashPassword, comparePassword, generateToken } = require('../utils/authUtils');
const User = require('../models/userModel');
const Startup = require('../models/startupModel');
const Otp = require('../models/otpModel');
const { sendNewRegistrationToAdmin, sendOtpToUser, sendRejectionToUser } = require('../utils/emailService');

const Joi = require('joi');

async function register(req, res) {
  try {
    // 1. Edge Case: Missing required fields -> 400 with clear message
    const schema = Joi.object({
      name: Joi.string().required().messages({
        'any.required': 'Name is required.',
        'string.empty': 'Name cannot be empty.'
      }),
      email: Joi.string().email().required().messages({
        'any.required': 'Email is required.',
        'string.email': 'Email must be a valid email address.',
        'string.empty': 'Email cannot be empty.'
      }),
      password: Joi.string().min(6).required().messages({
        'any.required': 'Password is required.',
        'string.min': 'Password must be at least 6 characters long.',
        'string.empty': 'Password cannot be empty.'
      }),
      role: Joi.string().valid('dept_admin', 'startup', 'evaluator', 'validator').required().messages({
        'any.required': 'Role is required.',
        'any.only': 'Invalid role provided.'
      }),
      department_name: Joi.string().optional().allow(null, ''),
      designation: Joi.string().optional().allow(null, '')
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { name, email, password, role, department_name, designation } = value;

    // 2. Edge Case: Register with an email that already exists -> 409
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const password_hash = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password_hash,
      role,
      department_name: role === 'dept_admin' ? department_name : null,
      designation,
    });

    if (role === 'startup') {
      await Startup.create({ user_id: newUser.id, company_name: name });
    } else if (role !== 'super_admin') {
      // 3. Notify superadmin for non-startup, non-superadmin registrations
      await sendNewRegistrationToAdmin(newUser);
    }

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  //  New check
  if (user.account_status === 'pending') {
    return res.status(403).json({ success: false, message: 'Your account is awaiting admin approval' });
  }
  if (user.account_status === 'rejected') {
    return res.status(403).json({ success: false, message: 'Access denied — registration was rejected' });
  }
  if (user.account_status === 'approved') {
    return res.status(403).json({ success: false, message: 'Please verify OTP to activate your account' });
  }
  // only 'active' proceeds

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const token = generateToken(user);
  return res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
}


// GET /api/auth/pending-users  (super_admin only)
async function getPendingUsers(req, res) {
  const users = await User.findPendingUsers();
  return res.json({ success: true, users });
}

// POST /api/auth/approve/:userId  (super_admin only)
async function approveUser(req, res) {
  const { userId } = req.params;
  const user = await User.updateStatus(userId, 'approved', req.user.user_id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.create(userId, otpCode);

  // Send the actual OTP email via Nodemailer
  await sendOtpToUser(user.email, otpCode);
  console.log(`OTP for ${user.email}: ${otpCode}`); // Keep for debug

  return res.json({ 
    success: true, 
    message: 'User approved, OTP generated', 
    mock_otp: otpCode // ⚠️ only exposing this for demo purposes — remove in real prod
  });
}

async function rejectUser(req, res) {
  const { userId } = req.params;
  const user = await User.updateStatus(userId, 'rejected', req.user.user_id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  // Send rejection email via Nodemailer
  await sendRejectionToUser(user.email);

  return res.json({ success: true, message: 'User rejected' });
}

// POST /api/auth/verify-otp
async function verifyOtp(req, res) {
  const { email, otp } = req.body;
  const user = await User.findByEmail(email);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const isValid = await Otp.verify(user.id, otp);
  if (!isValid) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

  await User.updateStatus(user.id, 'active', user.approved_by);
  return res.json({ success: true, message: 'Account activated. You can now log in.' });
}

module.exports = { register, login, getMe, getPendingUsers, approveUser, rejectUser, verifyOtp};