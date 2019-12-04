import UserService from '../services/UserService';
import User from '../models/user';
import GeneralService from '../services/GeneralService';
import FollowerService from '../services/FollowerService';
import UserProfileService from '../services/UserProfileService';
import TokenHelperClass from '../helper/TokenHelperClass';
import EmailHelperClass from '../helper/EmailHelperClass';
import UserHelperClass from '../helper/UserHelperClass';
import constants from '../constants';
import GeneralHelperClass from '../helper/GeneralHelperClass';
import sanitizedInputData from '../helper/sanitizeInputData';

/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */

/**
 * @Object UserResolver
 */

const UserResolver = {
  /**
   * @param {Object} args - argument
   * @return {Object} error response
   */
  signupUser: async (args) => {
    try {
      const savedUser = await UserService.create(args.userSignupInput);
      const token = TokenHelperClass.createToken(savedUser._id, '72h');
      await UserProfileService.create(args.userProfileInput, savedUser);
      EmailHelperClass.sendEmail(
        savedUser._doc.email,
        process.env.EMAIL_SENDER,
        constants.emailVerification.subject,
        `${constants.emailVerification.text} 
          <a href="${process.env.DEV_BASE_URL}/verify/${token}">link</a>`
      );
      return { ...savedUser._doc, password: null, token };
    } catch (error) {
      throw error;
    }
  },
  sendResetPasswordEmail: async (args) => {
    try {
      const savedUser = await UserService.findByEmail(args.email);
      if (Object.keys(savedUser).length > 0) {
        const token = TokenHelperClass.createToken(savedUser._id, '1h');
        EmailHelperClass.sendEmail(
          args.email,
          process.env.EMAIL_SENDER,
          constants.resetPassword.subject,
          `${constants.resetPassword.text} 
          <a href="${process.env.DEV_BASE_URL}/password_reset/${token}">
          link</a>`
        );
        return { token, password: null };
      }
    } catch (error) {
      throw error;
    }
  },
  resetUserPassword: async (args) => {
    try {
      if (!args.token) throw new Error('token not provided');
      const decodedToken = TokenHelperClass.verifyToken(args.token);
      if (decodedToken.error) {
        throw new Error('Token is expired or Invalid');
      }
      const hashedPassword = await UserHelperClass
        .encryptPassword(args.password);
      await GeneralService
        .update(User, { _id: decodedToken.decodedToken.userId },
          { password: hashedPassword });
    } catch (error) {
      throw error;
    }
  },
  loginUser: async (args) => {
    try {
      if (!args.usernameOrEmail) throw new Error('Enter username or email');
      if (!args.password) throw new Error('Enter password');
      const savedUser = await UserService
        .findByUsernameOrEmail(args.usernameOrEmail);
      if (savedUser === null) {
        throw new Error('Incorrect credentials');
      }
      const token = TokenHelperClass.createToken(savedUser._id, '72h');
      const isPasswordCorrect = await UserHelperClass
        .isPasswordCorrect(args.password, savedUser.password);
      if (!isPasswordCorrect) throw new Error('Incorrect credentials');
      return { ...savedUser._doc, password: null, token };
    } catch (error) {
      throw error;
    }
  },
  getUserProfile: async (args) => {
    try {
      const isUsernameValid = await GeneralHelperClass
        .usernameValidation(args.username);
      if (!isUsernameValid) throw new Error('Invalid username');
      const sanitizedUsername = sanitizedInputData.username(args.username);
      const savedUser = await UserService.findByUsername(sanitizedUsername);
      if (savedUser === null) throw new Error('User does not exist');
      return { ...savedUser._doc, password: null };
    } catch (error) {
      throw error;
    }
  },
  followUser: async (args) => {
    args = args.followInput;
    const userId = await UserHelperClass
      .validateTwoUsers(args.token, args.userId,
        'The user you are trying to follow does not exist');
    await UserHelperClass
      .validateFollower(args.userId, userId, 'follow');
    const followerObject = {
      follower: userId,
      userBeingFollowed: args.userId
    };
    await FollowerService.create(followerObject);
  },
  unfollowUser: async (args) => {
    args = args.unfollowInput;
    const userId = await UserHelperClass
      .validateTwoUsers(args.token, args.userId,
        'The user you are trying to unfollow does not exist');
    await UserHelperClass
      .validateFollower(args.userId, userId, 'unfollow');
    const followerObject = {
      follower: userId,
      userBeingFollowed: args.userId
    };
    await FollowerService.delete(followerObject);
  }
};

export default UserResolver;
