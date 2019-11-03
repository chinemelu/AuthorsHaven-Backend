import UserService from '../services/UserService';
import UserProfileService from '../services/UserProfileService';
import TokenHelperClass from '../helper/TokenHelperClass';
import EmailHelperClass from '../helper/EmailHelperClass';
import constants from '../constants';

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
      await UserService.update({ password: args.password },
        { _id: decodedToken.decoded.userId });
    } catch (error) {
      throw error;
    }
  }
};

export default UserResolver;
