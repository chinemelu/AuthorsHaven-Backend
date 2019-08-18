
import User from '../models/user';

/**
 * @Object UserResolver
 */
const UserResolver = {
  /**
   * @param {Object} args - argument
   * @return {Object} error response
   */
  signupUser: async (args) => {
    const user = new User({
      username: args.userSignupInput.username || '',
      firstname: args.userSignupInput.firstname || '',
      lastname: args.userSignupInput.lastname || '',
      password: args.userSignupInput.password || '',
      email: args.userSignupInput.email || ''
    });
    try {
      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      Object.keys(error.errors).forEach((errorProperty) => {
        const errorMessage = error.errors[errorProperty];
        throw new Error(errorMessage);
      });
    }
  }
};

export default UserResolver;
