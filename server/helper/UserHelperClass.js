import bcrypt from 'bcrypt';
import TokenHelperClass from './TokenHelperClass';
import ResponseHandler from './ResponseHandler';
import UserService from '../services/UserService';
import GeneralService from '../services/GeneralService';
import Follower from '../models/follower';


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
  * @param {String} ownerId - owner of the resource database Id
 * @param {String} requestUserId - person making the request
 * @returns {Object} - Object containing details of decoded token
 */
  static async hasAccess(ownerId, requestUserId) {
    return ownerId === requestUserId;
  }

  /**
  * @param {String} userId - id of user to be validated
  * @param {String} message - optional message
 * @returns {null} - null
 */
  static async validateUser(userId, message) {
    const savedUser = await UserService
      .findById(userId);
    if (savedUser === null) throw new Error(message || 'User does not exist');
  }

  /**
  * @param {String} userBeingFollowedId - id of user being followed
  * @param {String} followerId - id of follower
 * @returns {null} - null
 */
  static async validateFollower(userBeingFollowedId, followerId) {
    const existingFollowing = await GeneralService.findOne(Follower, ({
      $and: [{ follower: followerId },
        { userBeingFollowed: userBeingFollowedId }]
    }));
    if (existingFollowing) {
      throw new Error('You are already following this user');
    }
    if (userBeingFollowedId === followerId) {
      throw new Error('You cannot follow yourself');
    }
  }
}

export default UserHelperClass;
