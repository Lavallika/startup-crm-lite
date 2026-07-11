import jwt from 'jsonwebtoken';

/**
 * Generates a signed JWT token containing the user's ID as payload.
 * Uses JWT_SECRET and JWT_EXPIRES_IN from environment variables.
 * 
 * @param {string} userId - The unique user database identifier.
 * @returns {string} The signed JSON Web Token string.
 */
export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

export default generateToken;
