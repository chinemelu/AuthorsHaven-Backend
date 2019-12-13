import User from '../models/user';
import GeneralHelperClass from '../helper/GeneralHelperClass';

/**
 * it handles all database calls with respect to a user
 */
class UserService {
  /**
   * creates a new user
    * @param {Object} userObject - the user object
    * @returns {Object} savedUser
    */
  static async create(userObject) {
    try {
      const user = new User({
        username: userObject.username,
        firstname: userObject.firstname,
        lastname: userObject.lastname,
        password: userObject.password,
        email: userObject.email
      });
      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      GeneralHelperClass.handleModelValidationErrors(error);
    }
  }

  /**
   * checks if a user exists using an email
    * @param {String} email - the email of a user
    * @returns {Object} user object or empty object
    */
  static async findByEmail(email) {
    try {
      const user = await User.findOne({ email });
      if (Object.keys(user).length > 0) {
        return user;
      }
      return {};
    } catch (error) {
      throw error;
    }
  }

  /**
   * checks if a user exists using an email
    * @param {String} username - the username of a user
    * @returns {Object} user object or empty object
    */
  static async findByUsername(username) {
    try {
      const firstPopulation = {
        path: 'profile',
        model: 'Profile',
        populate: { path: 'followers' }
      };
      const secondPopulation = {
        path: 'profile',
        model: 'Profile',
        populate: {
          path: 'bookmarks',
          model: 'Article',
          populate: { path: 'author', model: 'User' },
        },
      };
      const user = await User.findOne({ username })
        .populate(firstPopulation).populate(secondPopulation);
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * find a user by username or email
    * @param {String} usernameOrEmail - username or email
    * @returns {Object} user object or empty object
    */
  static async findByUsernameOrEmail(usernameOrEmail) {
    try {
      const user = await User.findOne({
        $or: [{ username: usernameOrEmail },
          { email: usernameOrEmail }]
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
