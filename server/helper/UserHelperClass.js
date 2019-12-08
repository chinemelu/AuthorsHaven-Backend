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
   * @param {String} articleBody - body of the article being checked
   * @returns {Number} - time taken to read
   */
  static timeToReadArticle(articleBody) {
    try {
      const wordsPerMinute = 200;
      const articleBodyLength = articleBody.split(' ').length;
      const timeToRead = articleBodyLength / wordsPerMinute;
      return timeToRead;
    } catch (error) {
      throw error;
    }
  }

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
 * @returns {null} - null
 */
  static async validateUser(token) {
    const isTokenValid = TokenHelperClass.validateToken(token);
    const { userId } = isTokenValid.decodedToken;
    const savedUser = await GeneralService
      .findById(User, userId);
    if (savedUser === null) throw new Error('User does not exist');
    return userId;
  }

  /**
  * @param {String} token - the jwt token received upon login/signup
  * @param {String} secondUserId - id of user apart from user in a token
  * @param {String} message - optional message
 * @returns {null} - null
 */
  static async validateTwoUsers(token, secondUserId, message) {
    const isTokenValid = TokenHelperClass.validateToken(token);
    const { userId } = isTokenValid.decodedToken;
    const savedTokenUser = await GeneralService
      .findById(User, userId);
    if (savedTokenUser === null) throw new Error('User does not exist');
    const isUserIdValid = GeneralHelperClass.isIdValid(secondUserId);
    if (!isUserIdValid) throw new Error('Invalid userId');
    const secondUser = await GeneralService
      .findById(User, secondUserId);
    if (secondUser === null) throw new Error(message);
    return userId;
  }

  /**
  * @param {String} type - if validating followerUser or unfollowUser
  * @param {String} existingFollowing - optional message
 * @returns {null} - null
 */
  static validateExistingFollowing(type, existingFollowing) {
    if (type === 'follow' && existingFollowing) {
      throw new Error('You are already following this user');
    }
    if (type === 'unfollow' && !existingFollowing) {
      throw new Error('You are not following this user');
    }
  }


  /**
  * @param {String} type - if validating followerUser or unfollowUser
  * @param {String} userBeingFollowedId - id of user being followed
  * @param {String} followerId - id of follower
 * @returns {null} - null
 */
  static validateSelfFollow(type, userBeingFollowedId, followerId) {
    if (type === 'follow' && userBeingFollowedId === followerId) {
      throw new Error('You cannot follow yourself');
    }
    if (type === 'unfollow' && userBeingFollowedId === followerId) {
      throw new Error('You cannot unfollow yourself');
    }
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
    UserHelperClass.validateSelfFollow(type, userBeingFollowedId, followerId);
    UserHelperClass.validateExistingFollowing(type, existingFollowing);
  }
}

export default UserHelperClass;
