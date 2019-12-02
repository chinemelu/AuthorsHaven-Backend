import bcrypt from 'bcrypt';
import TokenHelperClass from './TokenHelperClass';
import GeneralHelperClass from './GeneralHelperClass';
import ResponseHandler from './ResponseHandler';
import User from '../models/user';
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
  * @param {String} token - the jwt token received upon login/signup
  * @param {String} secondUserId - id of user apart from user in a token
  * @param {String} message - optional message
 * @returns {null} - null
 */
  static async validateUser(token, secondUserId, message) {
    let userId = secondUserId;
    if (token) {
      const isTokenValid = TokenHelperClass.validateToken(token);
      ({ userId } = isTokenValid.decodedToken);
    }
    const isUserIdValid = GeneralHelperClass.isIdValid(userId);
    if (!isUserIdValid) throw new Error('Invalid userId');
    const savedUser = await GeneralService
      .findById(User, userId);
    if (savedUser === null) throw new Error(message || 'User does not exist');
    return userId;
  }

  /**
  * @param {String} userBeingFollowedId - id of user being followed
  * @param {String} followerId - id of follower
  * @param {String} type - if validating followerUser or unfollowUser
 * @returns {null} - null
 */
  static async validateFollower(userBeingFollowedId, followerId, type) {
    const existingFollowing = await GeneralService.findOne(Follower, ({
      $and: [{ follower: followerId },
        { userBeingFollowed: userBeingFollowedId }]
    }));
    if (type === 'follow' && existingFollowing) {
      throw new Error('You are already following this user');
    }
    if (type === 'follow' && userBeingFollowedId === followerId) {
      throw new Error('You cannot follow yourself');
    }
    if (type === 'unfollow' && !existingFollowing) {
      throw new Error('You are not following this user');
    }
    if (type === 'unfollow' && userBeingFollowedId === followerId) {
      throw new Error('You cannot unfollow yourself');
    }
  }
}

export default UserHelperClass;
