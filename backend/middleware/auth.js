import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * protect - JWT Authentication Middleware
 *
 * Extracts and verifies the JWT from the Authorization header.
 * On success, attaches the authenticated user to req.user.
 * On failure, passes a structured error to next() for global errorHandler.
 *
 * Usage: apply as route middleware for any protected endpoint.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Extract token from "Authorization: Bearer <token>" header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Reject if no token is present
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, access denied'
      });
    }

    // 3. Verify the token signature and expiry
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      // Handle token expiry specifically
      if (jwtErr.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired, please login again'
        });
      }
      // Any other JWT error (malformed, wrong signature, etc.)
      return res.status(401).json({
        success: false,
        message: 'Token is invalid'
      });
    }

    // 4. Ensure the user referenced in the token still exists in the database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists'
      });
    }

    // 5. Attach the user document to req for downstream access
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default protect;
