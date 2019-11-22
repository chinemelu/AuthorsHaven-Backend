import bcrypt from 'bcrypt';
import TokenHelperClass from './TokenHelperClass';
import ResponseHandler from './ResponseHandler';

/**
 * Helper class for all things relating to users
 */
class UserHelperClass {
/**
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {Object} - Object containing details of decoded token
 */
  static verifyUserIdentityFromTokenParams(req, res) {
    const { token } = req.params;
    const verifiedToken = TokenHelperClass.verifyToken(token);
    if (verifiedToken.error) {
      return ResponseHandler.error(401, 'Invalid Token', res);
    }
  }

  /**
  * @param {String} inputPassword - password entered by user
 * @param {String} passwordHash - user password in database
 * @returns {Object} - Object containing details of decoded token
 */
  static async isPasswordCorrect(inputPassword, passwordHash) {
    const match = await bcrypt.compare(inputPassword, passwordHash);

    if (match) {
      return true;
    }
    return false;
  }

  /**
  * @param {String} password - password to be hashed
 * @param {String} saltRounds - cost factor for hashing password
 * @returns {Object} - Object containing details of decoded token
 */
  static async encryptPassword(password) {
    const saltRounds = 8;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  /**
  * @param {String} ownerId - owner of the resource database Id
 * @param {String} requestUserId - person making the request
 * @returns {Object} - Object containing details of decoded token
 */
  static async hasAccess(ownerId, requestUserId) {
    return ownerId === requestUserId;
  }
}

export default UserHelperClass;
