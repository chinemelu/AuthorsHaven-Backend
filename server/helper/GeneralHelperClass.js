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
}

export default GeneralHelperClass;
