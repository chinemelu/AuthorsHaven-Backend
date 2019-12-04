import ArticleService from '../services/ArticleService';
import UserHelperClass from './UserHelperClass';
import GeneralService from '../services/GeneralService';
import GeneralHelperClass from './GeneralHelperClass';
import Reply from '../models/reply';
import Comment from '../models/comments';
import Bookmark from '../models/bookmark';

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
      const Model = type === 'comment' ? Comment : Reply;
      const savedType = await GeneralService.findById(Model, id);
      if (savedType === null) throw new Error(`${type} does not exist`);
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {Object} args - the argument from the graphQL schema
   * @param {String} type - whether 'comment' or 'reply'
   * @returns {String} - the id of a valid user
   */
  static async validateCommentFields(args, type) {
    const userId = await UserHelperClass.validateUser(args.token);
    await ArticleHelperClass.validateArticle(args.articleId);
    await ArticleHelperClass
      .validateComment(
        type === 'comment' ? args.commentId : args.replyId, type
      );
    return userId;
  }

  /**
   *
   * @param {String} articleId - the id of the article in the bookmark
   * @param {String} userId - the user trying to bookmark he article
   * @returns {null} - null
   */
  static async validateBookmark(articleId, userId) {
    const existingBookmark = await GeneralService.findOne(Bookmark, ({
      $and: [{ owner: userId },
        { article: articleId }]
    }));
    if (existingBookmark) throw new Error('Bookmark already exists');
  }
}

export default ArticleHelperClass;
