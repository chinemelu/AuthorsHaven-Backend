import ArticleService from '../services/ArticleService';
import GeneralService from '../services/GeneralService';
import GeneralHelperClass from './GeneralHelperClass';
import Reply from '../models/reply';
import Comment from '../models/comments';

/**
 * Helper class for all things relating to tokens
 */
class ArticleHelperClass {
  /**
 * @param {String} articleId - the id of the article to be validated
 * @returns {Object} the savedArticle if it exists or null if it doesn't
 */
  static async validateArticle(articleId) {
    if (!articleId) throw new Error('ArticleId is required');
    const isIdValid = GeneralHelperClass.isIdValid(articleId);
    if (!isIdValid) throw new Error('Invalid articleId');
    const savedArticle = await ArticleService.findById(articleId);
    if (savedArticle === null) throw new Error('Article does not exist');
    return savedArticle;
  }

  /**
 * @param {String} id - the id of the comment/reply to be validated
 * @param {String} type - type of comment - 'reply' or 'comment'
 * @returns {null} the token
 */
  static async validateComment(id, type) {
    try {
      if (!id) throw new Error(`${type} Id is required`);
      const isIdValid = GeneralHelperClass.isIdValid(id);
      if (!isIdValid) throw new Error(`Invalid ${type}Id`);
      let savedType;
      if (type === 'comment') {
        savedType = await GeneralService.findById(Comment, id);
      } else {
        savedType = await GeneralService.findById(Reply, id);
      }
      if (savedType === null) throw new Error(`${type} does not exist`);
    } catch (error) {
      throw error;
    }
  }

//   /**
//  * @param {String} replyId - the id of the reply to be validated
//  * @returns {null} the token
//  */
//   static async validateReply(replyId) {
//     try {
//       if (!replyId) throw new Error('ReplyId is required');
//       const isIdValid = GeneralHelperClass.isIdValid(replyId);
//       if (!isIdValid) throw new Error('Invalid replyId');
//       const savedReply = await ReplyService.findReplyById(replyId);
//       if (savedReply === null) throw new Error('Reply does not exist');
//     } catch (error) {
//       throw error;
//     }
//   }
}

export default ArticleHelperClass;
