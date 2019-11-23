import UserService from '../services/UserService';
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
      const token = TokenHelperClass.createToken(savedUser._id, '12h');
      await UserProfileService.create(args.userProfileInput, savedUser._id);
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
      await UserService.update({ _id: decodedToken.decodedToken.userId },
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
      const token = TokenHelperClass.createToken(savedUser._id, '12h');
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
  }
};

export default UserResolver;
