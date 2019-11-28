import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * Helper class general things
 */
class GeneralHelperClass {
  /**
   * @param {Object} id - input id
   * @returns {Object} - Object containing details of decoded token
   */
  static isIdValid(id) {
    const { ObjectId } = mongoose.Types;
    return ObjectId.isValid(id);
  }

  /**
   * @param {Object} username - input username
   * @returns {Boolean} - boolean if username passes/fails regex
   */
  static usernameValidation(username) {
    const usernameValidationRegex = /^\w+$/;
    return usernameValidationRegex.test(username);
  }

  /**
   * @param {String} id - id to be converted
   * @returns {Object} - converted id
   */
  static convertIdStringToObjectId(id) {
    const { ObjectId } = mongoose.Types;
    return new ObjectId(id);
  }

  /**
  * @param {String} password - password to be hashed
 * @param {String} saltRounds - cost factor for hashing password
 * @returns {Object} - Object containing details of decoded token
 */
  static async encryptPassword(password) {
    const saltRounds = 8;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  /**
  * @param {Object} error - error from model validation
 * @returns {null} - No value is returned
 */
  static handleModelValidationErrors(error) {
    return Object.keys(error.errors).forEach((errorProperty) => {
      const errorMessage = error.errors[errorProperty];
      throw new Error(errorMessage);
    });
  }
}

export default GeneralHelperClass;
