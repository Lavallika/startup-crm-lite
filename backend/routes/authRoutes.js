import express from 'express';
import { body } from 'express-validator';

import {
  register,
  login,
  getProfile,
  updateProfile,
  logout
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

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
    .normalizeEmail(),

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
    .toLowerCase(), // keep consistent casing without altering the address structure

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
    .notEmpty().withMessage('Old password is required when setting a new password')
];

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

// NOTE FOR PRODUCTION: Add express-rate-limit middleware before register and login routes
// to prevent brute-force and credential-stuffing attacks. Example:
//   import rateLimit from 'express-rate-limit';
//   const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
//   router.post('/login', authLimiter, validate(loginValidations), login);

// POST /api/auth/register — Public: Create new user account
router.post('/register', validate(registerValidations), register);

// POST /api/auth/login — Public: Authenticate and receive JWT token
router.post('/login', validate(loginValidations), login);

// GET /api/auth/profile — Protected: Get current logged-in user's profile
router.get('/profile', protect, getProfile);

// PUT /api/auth/profile — Protected: Update name or password
router.put('/profile', protect, validate(updateProfileValidations), updateProfile);

// POST /api/auth/logout — Protected: Logout (client-side token removal)
router.post('/logout', protect, logout);

export default router;
