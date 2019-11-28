import ArticleService from '../services/ArticleService';
import CommentService from '../services/CommentService';
import GeneralHelperClass from './GeneralHelperClass';
import ReplyService from '../services/ReplyService';


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
 * @param {String} commentId - the id of the comment to be validated
 * @returns {null} the token
 */
  static async validateComment(commentId) {
    try {
      if (!commentId) throw new Error('Comment Id is required');
      const isIdValid = GeneralHelperClass.isIdValid(commentId);
      if (!isIdValid) throw new Error('Invalid commentId');
      const savedComment = await CommentService.findCommentById(commentId);
      if (savedComment === null) throw new Error('Comment does not exist');
    } catch (error) {
      throw error;
    }
  }

  /**
 * @param {String} replyId - the id of the reply to be validated
 * @returns {null} the token
 */
  static async validateReply(replyId) {
    try {
      if (!replyId) throw new Error('ReplyId is required');
      const isIdValid = GeneralHelperClass.isIdValid(replyId);
      if (!isIdValid) throw new Error('Invalid replyId');
      const savedReply = await ReplyService.findReplyById(replyId);
      if (savedReply === null) throw new Error('Reply does not exist');
    } catch (error) {
      throw error;
    }
  }
}

export default ArticleHelperClass;
