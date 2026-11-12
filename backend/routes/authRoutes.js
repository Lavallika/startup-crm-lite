import express from 'express';
import { body } from 'express-validator';
import { rateLimit } from 'express-rate-limit';

import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  deleteAccount
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// AUTH RATE LIMITER
// Stricter limits applied specifically to public authentication attempts
// (login and registration) to prevent brute-force attacks without blocking
// authenticated profile or session verification requests.
// ─────────────────────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 100 : 25, // 25 attempts in prod, 100 in dev
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again after 15 minutes.'
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION RULE SETS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validation rules for POST /register
 * Validates name (min 2 chars), email format, and password strength (min 6 chars)
 */
const registerValidations = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .toLowerCase(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

/**
 * Validation rules for POST /login
 * Validates that email and password fields are present and correctly formatted
 */
const loginValidations = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .toLowerCase(),

  body('password')
    .notEmpty().withMessage('Password is required')
];

/**
 * Validation rules for PUT /profile
 * Name is optional but if present must meet length constraints.
 * newPassword is optional; if provided, oldPassword must also be present.
 */
const updateProfileValidations = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),

  body('newPassword')
    .optional()
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),

  body('oldPassword')
    .if(body('newPassword').exists())
    .notEmpty().withMessage('Current password is required when setting a new password')
];

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/auth/register — Public: Create new user account with rate limiting
router.post('/register', authLimiter, validate(registerValidations), register);

// POST /api/auth/login — Public: Authenticate and receive JWT token with rate limiting
router.post('/login', authLimiter, validate(loginValidations), login);

// GET /api/auth/profile — Protected: Get current logged-in user's profile
router.get('/profile', protect, getProfile);

// PUT /api/auth/profile — Protected: Update name, notification preferences, or password
router.put('/profile', protect, validate(updateProfileValidations), updateProfile);

// POST /api/auth/logout — Protected: Logout (client-side token removal)
router.post('/logout', protect, logout);

// DELETE /api/auth/account — Protected: Permanently delete account + all owned leads
router.delete('/account', protect, deleteAccount);

export default router;
