import ArticleService from '../services/ArticleService';
import UserHelperClass from './UserHelperClass';
import GeneralService from '../services/GeneralService';
import GeneralHelperClass from './GeneralHelperClass';
import Reply from '../models/reply';
import Comment from '../models/comments';
import Bookmark from '../models/bookmark';
import constants from '../constants';

/* eslint no-underscore-dangle:
 ["error", { "allow": ["_id", "_doc", "_session"] }] */
/**

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
   * @param {String} bookmarkAction - 'create' or 'delete'
   * @returns {null} - null
   */
  static async validateBookmark(articleId, userId, bookmarkAction) {
    const existingBookmark = await GeneralService.findOne(Bookmark, ({
      $and: [{ owner: userId },
        { article: articleId }]
    }));
    if (bookmarkAction === constants.bookmarkEnums.CREATE
      && existingBookmark) throw new Error('Bookmark already exists');
    if (bookmarkAction === constants.bookmarkEnums.DELETE
       && !existingBookmark) {
      throw new Error('Bookmark does not exist');
    }
  }

  /**
   *@param {Array} typeArray - array containing validation to be performed
   * @param {String} savedArticle - the article in the database
   * @param {String} userId - the user in the token
   * @returns {null} - null
   */
  static async checkIfUserHasAccess(typeArray, savedArticle, userId) {
    const { articleEnums } = constants;
    if (typeArray.indexOf(articleEnums.HAS_ACCESS) > -1) {
      const userHasWriteAccess = await UserHelperClass
        .hasAccess(savedArticle.author.toString(), userId);
      if (!userHasWriteAccess) throw new Error("You don't have write access");
    }
  }

  /**
   *@param {Array} typeArray - array containing validation to be performed
   * @param {String} articleId - the id of article to be bookmarked
   * @param {String} userId - the user in the token
   *  @param {String} bookmarkAction - 'create' or 'delete'
   * @returns {null} - null
   */
  static async checkIfBookmarkExists(
    typeArray, articleId, userId, bookmarkAction
  ) {
    const { articleEnums } = constants;
    if (typeArray.indexOf(articleEnums.BOOKMARK) > -1) {
      await ArticleHelperClass
        .validateBookmark(articleId, userId, bookmarkAction);
    }
  }

  /**
   * @param {String} token - the jwt token
   * @param {String} articleId - the id of the article
   * @param {Object} type - enumerated values determining validation to apply
   * @param {String} bookmarkAction - 'create' or 'delete'
   * @returns {null} - null
   */
  static async validateInput(token, articleId, type = {}, bookmarkAction = '') {
    try {
      const userId = await UserHelperClass.validateUser(token);
      const savedArticle = await ArticleHelperClass.validateArticle(articleId);
      const typeArray = Object.values(type);
      await ArticleHelperClass
        .checkIfUserHasAccess(typeArray, savedArticle, userId);

      await ArticleHelperClass
        .checkIfBookmarkExists(typeArray, articleId, userId, bookmarkAction);
      return { userId, savedArticle };
    } catch (error) {
      throw error;
    }
  }
}

export default ArticleHelperClass;
