
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
  }
};

export default UserResolver;
