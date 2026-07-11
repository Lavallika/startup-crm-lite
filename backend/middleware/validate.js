import { validationResult } from 'express-validator';

/**
 * validate(validations) - Express-Validator Middleware Factory
 *
 * Wraps an array of express-validator check() chains into a single
 * reusable middleware. Runs all validations against the request, collects
 * all errors, and returns a structured 400 response if any fail.
 *
 * @param {Array} validations - Array of express-validator check() chains
 * @returns {Function} Express middleware function
 *
 * Usage: router.post('/register', validate(registerValidations), controller)
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validation checks in parallel
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Collect validation errors from the request
    const errors = validationResult(req);

    // Pass through to the next middleware if all validations pass
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors into { field, message } shape for consistent API output
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  };
};

export default validate;
