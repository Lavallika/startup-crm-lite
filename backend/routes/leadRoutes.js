import express from 'express';
import { body } from 'express-validator';

import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
  searchLeads
} from '../controllers/leadController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL MIDDLEWARE: protect applies to ALL routes in this file
// ─────────────────────────────────────────────────────────────────────────────
router.use(protect);

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION RULE SETS
// ─────────────────────────────────────────────────────────────────────────────

// Valid enum values must match the Lead model schema exactly
const VALID_STATUSES = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
const VALID_SOURCES  = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

/**
 * Validation rules for creating a new lead (POST /api/leads)
 * All required fields validated. Optional fields (phone, notes) are not enforced.
 */
const createLeadValidations = [
  body('name')
    .trim()
    .notEmpty().withMessage('Lead name is required')
    .isLength({ min: 2 }).withMessage('Lead name must be at least 2 characters long')
    .isLength({ max: 100 }).withMessage('Lead name cannot exceed 100 characters'),

  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),

  body('status')
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),

  body('source')
    .optional()
    .isIn(VALID_SOURCES)
    .withMessage(`Source must be one of: ${VALID_SOURCES.join(', ')}`),

  body('notes')
    .optional()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters')
];

/**
 * Validation rules for fully updating a lead (PUT /api/leads/:id)
 * All fields optional since partial updates are allowed.
 */
const updateLeadValidations = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Lead name must be at least 2 characters long')
    .isLength({ max: 100 }).withMessage('Lead name cannot exceed 100 characters'),

  body('company')
    .optional()
    .trim()
    .notEmpty().withMessage('Company name cannot be empty'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email address'),

  body('status')
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),

  body('source')
    .optional()
    .isIn(VALID_SOURCES)
    .withMessage(`Source must be one of: ${VALID_SOURCES.join(', ')}`),

  body('notes')
    .optional()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters')
];

/**
 * Validation rules for status-only update (PATCH /api/leads/:id/status)
 */
const updateStatusValidations = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`)
];

// ─────────────────────────────────────────────────────────────────────────────
// STATS ROUTES — must be defined BEFORE /:id to avoid Express matching
// 'stats' as a MongoDB ObjectId parameter
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/leads/stats/summary — Dashboard stats cards data
router.get('/stats/summary', getLeadStats);

// GET /api/leads/stats/monthly — Analytics bar chart monthly data
router.get('/stats/monthly', getMonthlyStats);

// GET /api/leads/search — Quick search for autocomplete
router.get('/search', searchLeads);

// ─────────────────────────────────────────────────────────────────────────────
// CRUD ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// GET    /api/leads        — Get all leads (filtered, paginated, sorted)
// POST   /api/leads        — Create a new lead
router
  .route('/')
  .get(getLeads)
  .post(validate(createLeadValidations), createLead);

// GET    /api/leads/:id    — Get one lead by ID
// PUT    /api/leads/:id    — Update a lead completely
// DELETE /api/leads/:id    — Delete a lead permanently
router
  .route('/:id')
  .get(getLeadById)
  .put(validate(updateLeadValidations), updateLead)
  .delete(deleteLead);

// PATCH  /api/leads/:id/status — Update only the status field
router.patch('/:id/status', validate(updateStatusValidations), updateLeadStatus);

export default router;
