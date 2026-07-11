/**
 * Sends a consistent success JSON response.
 * 
 * @param {Object} res - Express response object
 * @param {any} data - Payload data to return
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (defaults to 200)
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Sends a consistent error JSON response.
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Error description message
 * @param {number} statusCode - HTTP status code (defaults to 500)
 * @param {any} errors - Additional validation or error details (defaults to null)
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

/**
 * Sends a consistent paginated success JSON response.
 * 
 * @param {Object} res - Express response object
 * @param {Array} data - Array of payload records for the current page
 * @param {number} total - Total count of records across all pages
 * @param {number} page - Current page index
 * @param {number} limit - Number of records per page
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  });
};
