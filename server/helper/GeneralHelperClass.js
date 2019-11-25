import mongoose from 'mongoose';
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
}

export default GeneralHelperClass;
