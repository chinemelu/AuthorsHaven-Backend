import jwt from 'jsonwebtoken';

/**
 * Helper class for all things relating to tokens
 */
class TokenHelperClass {
/**
 * @param {String} token - token to be verified
 * @returns {Object} - Object containing details of decoded token
 */
  static verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return { error: err };
      }
      return { decodedToken: decoded };
    });
  }

  /**
 * @param {String} userId the id of the user
 * @param {String} tokenExpiryTime - time it takes the token to expire
 * @returns {String} the token
 */
  static createToken(userId, tokenExpiryTime) {
    try {
      return jwt.sign({
        userId
      }, process.env.JWT_SECRET, { expiresIn: tokenExpiryTime });
    } catch (err) {
      throw err;
    }
  }

  /**
 * @param {String} token - the token to be validated
 * @returns {String} the token
 */
  static validateToken(token) {
    if (!token) throw new Error('No token provided');
    const isTokenValid = TokenHelperClass.verifyToken(token);
    if (isTokenValid.error) throw new Error('Invalid token');
    return isTokenValid;
  }
}

export default TokenHelperClass;
