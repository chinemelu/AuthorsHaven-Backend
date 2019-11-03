import User from '../models/user';

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
        username: userObject.username || '',
        firstname: userObject.firstname || '',
        lastname: userObject.lastname || '',
        password: userObject.password || '',
        email: userObject.email || ''
      });
      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      Object.keys(error.errors).forEach((errorProperty) => {
        const errorMessage = error.errors[errorProperty];
        throw new Error(errorMessage);
      });
    }
  }

  /**
   * checks if a user exists using an id
    * @param {String} id - the id of a user
    * @returns {Object} user object or empty object
    */
  static async findById(id) {
    try {
      const user = await User.findOne({ _id: id });
      if (user) {
        return user;
      }
      return {};
    } catch (error) {
      return 'Database error';
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
      if (user) {
        return user;
      }
      return {};
    } catch (error) {
      console.log('error', error);
    }
  }

  /**
   * checks if a user exists using an id
    * @param {Object} identifier - the parameter used to identify the db entity
    * @param {Object} toBeUpdated - the parameter to be updated on the database
    * @returns {Object} user object or empty object
    */
  static async update(identifier, toBeUpdated) {
    try {
      await User.updateOne(identifier, toBeUpdated);
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
