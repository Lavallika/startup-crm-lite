/**
 * mongoSanitize.js
 *
 * Express 5-compatible MongoDB input sanitization middleware.
 *
 * Why a custom implementation?
 * `express-mongo-sanitize@2.x` is incompatible with Express 5 because it attempts
 * to mutate `req.query`, which is now a read-only getter in Express 5.
 * This middleware achieves the same goal (stripping NoSQL injection operators)
 * by only touching `req.body` and `req.params`, which are still writable.
 *
 * What it does:
 * Recursively removes any object key that:
 *   - Starts with `$`  (MongoDB operator prefix, e.g. `$where`, `$gt`)
 *   - Contains a `.`  (dot notation path traversal, e.g. `user.password`)
 */

/**
 * Recursively sanitizes a value by removing dangerous keys from objects.
 * Primitive values and arrays are handled transparently.
 *
 * @param {*} value - The value to sanitize.
 * @returns {*} The sanitized value.
 */
const sanitizeValue = (value) => {
  // Null / primitives pass through unchanged
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Recurse into arrays
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  // Strip dangerous keys and recurse into nested objects
  const sanitized = {};
  for (const key of Object.keys(value)) {
    if (key.startsWith('$') || key.includes('.')) {
      // Drop this key entirely — it's a MongoDB operator or path traversal attempt
      continue;
    }
    sanitized[key] = sanitizeValue(value[key]);
  }
  return sanitized;
};

/**
 * Express middleware that sanitizes `req.body` and `req.params` in-place.
 * Safe for Express 5 — does NOT touch the read-only `req.query` getter.
 */
const mongoSanitize = (req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }

  next();
};

export default mongoSanitize;
