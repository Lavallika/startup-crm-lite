import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: generateToken
// Not a route handler. Signs a JWT containing the user's database ID.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a signed JWT token for a user.
 *
 * @param {string} userId - The MongoDB user _id
 * @returns {string} Signed JWT token string
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ROUTES
// NOTE FOR PRODUCTION: Apply express-rate-limit to register and login routes
// to prevent brute-force attacks. Example:
//   import rateLimit from 'express-rate-limit';
//   const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
//   router.post('/login', authLimiter, loginValidations, login);
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Register a new user account
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if a user with this email already exists before creating
    // (Mongoose will also catch duplicates via code 11000, but explicit check
    // gives a cleaner 409 response vs relying on the error handler)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'Email already exists', 409);
    }

    // Create the user — bcrypt pre-save hook in User.js hashes the password automatically
    const user = await User.create({ name, email, password, role });

    // Generate JWT token: payload contains user's id
    const token = generateToken(user._id);

    // Return 201 — user.toJSON() strips the password field automatically
    return successResponse(res, { token, user }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user and return JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(`[Login Attempt] Received email: "${email}" (casing/spaces check), password length: ${password ? password.length : 0}`);
    
    // Find user including the password field (select: false is not set on schema,
    // but using .select('+password') is explicit best practice for security-sensitive fields)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log(`[Login Failed] No user found in database with email: "${email}"`);
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const isMatch = await user.comparePassword(password);
    console.log(`[Login Check] User found. Password compare result: ${isMatch}`);

    // Verify user exists AND password matches in a single generic error message.
    // SECURITY: Never reveal whether the email or password was incorrect — this
    // prevents user enumeration attacks.
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Check if the account has been deactivated by an admin
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    // Sign a fresh JWT token
    const token = generateToken(user._id);

    // Return 200 — toJSON() strips the password field
    return successResponse(res, { token, user }, 'Logged in successfully', 200);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PROTECTED ROUTES (require valid JWT via protect middleware)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Get the currently authenticated user's profile
 * @route   GET /api/auth/profile
 * @access  Protected
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user is already populated by the protect middleware (password excluded)
    return successResponse(res, { user: req.user }, 'Profile retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update the authenticated user's name or password
 * @route   PUT /api/auth/profile
 * @access  Protected
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, oldPassword, newPassword } = req.body;

    // Fetch the full user document including password for comparison
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Handle password update — requires old password verification first
    if (newPassword) {
      if (!oldPassword) {
        return errorResponse(res, 'Old password is required to set a new password', 400);
      }

      // Verify old password is correct before allowing change
      const isOldPasswordValid = await user.comparePassword(oldPassword);
      if (!isOldPasswordValid) {
        return errorResponse(res, 'Old password is incorrect', 401);
      }

      // Set new password — the pre-save hook will hash it automatically on save()
      user.password = newPassword;
    }

    // Persist changes (triggers bcrypt pre-save hook if password was changed)
    await user.save();

    // Re-fetch without password to return clean user object
    const updatedUser = await User.findById(user._id).select('-password');

    return successResponse(res, { user: updatedUser }, 'Profile updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout the authenticated user (client-side token invalidation)
 * @route   POST /api/auth/logout
 * @access  Protected
 *
 * NOTE: JWT tokens are stateless — the server cannot "invalidate" them.
 * The client must delete the token from localStorage to complete logout.
 * For true server-side invalidation, implement a token blacklist or
 * switch to short-lived tokens + refresh token rotation.
 */
export const logout = async (req, res, next) => {
  try {
    return successResponse(res, null, 'Logged out successfully. Please delete your token on the client.', 200);
  } catch (error) {
    next(error);
  }
};
