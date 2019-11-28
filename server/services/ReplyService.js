import Reply from '../models/reply';

/* eslint no-underscore-dangle:
 ["error", { "allow": ["_id", "_doc", "_session"] }] */

/**
 * it handles all database calls with respect to an article
 */
class ReplyService {
  /**
   * finds and updates a comment by Id
    * @param {String} id - id property of article
    * @param {Object} fieldObjectToBeUpdated - the field to be updated
    * @returns {null} returns null
    */
  static async findOneAndUpdate(id, fieldObjectToBeUpdated) {
    try {
      await Reply.findOneAndUpdate({ _id: id },
        { $push: fieldObjectToBeUpdated });
    } catch (error) {
      throw error;
    }
  }

  /**
   * finds a reply using its id
    * @param {String} id - id property of reply
    * @param {Object} fieldObjectToBeUpdated - the field to be updated
    * @returns {null} returns null
    */
  static async findReplyById(id) {
    try {
      const savedReply = await Reply.findById(id);
      return savedReply;
    } catch (error) {
      throw error;
    }
  }
}

export default ReplyService;
