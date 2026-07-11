import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global Express Error Handling Middleware.
 * Standardizes error responses across the application for Mongoose validation,
 * database duplicate keys, JWT auth issues, and unhandled system errors.
 */
const errorHandler = (err, req, res, next) => {
  // Set default status code and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = null;

  // 1. Handle Mongoose Validation Error (Code 400)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = {};
    // Build a field-by-field key-value error map
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
  }

  // 2. Handle Mongoose Cast Error (Invalid ObjectId) (Code 404)
  else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // 3. Handle MongoDB Duplicate Key Error (Code 11000) (Code 409)
  else if (err.code === 11000) {
    statusCode = 409;
    // Spec requested mapping 11000 directly to "Email already exists"
    message = 'Email already exists';
    
    // We can also extract the duplicate field dynamically if needed:
    if (err.keyValue) {
      errors = {};
      Object.keys(err.keyValue).forEach((key) => {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} already exists`;
      });
    }
  }

  // 4. Handle JWT Verification & Expiration Errors (Code 401)
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please authenticate again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired. Please log in again.';
  }

  // Build the final response payload
  const isDev = process.env.NODE_ENV === 'development';
  const responseBody = {
    success: false,
    message,
    ...(errors && { errors }),
    ...(isDev && { stack: err.stack }) // Include stack trace in dev only
  };

  return res.status(statusCode).json(responseBody);
};

export default errorHandler;
