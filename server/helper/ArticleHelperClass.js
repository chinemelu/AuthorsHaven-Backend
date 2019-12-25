import ArticleService from '../services/ArticleService';
import UserHelperClass from './UserHelperClass';
import GeneralService from '../services/GeneralService';
import GeneralHelperClass from './GeneralHelperClass';
import Bookmark from '../models/bookmark';
import Rating from '../models/rating';
import Like from '../models/like';
import Report from '../models/report';
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
   *
   * @param {String} args - the argument object
   * @param {String} userId - the user of a validated user in the token
   * @returns {null} - null
   */
  static async validateRating(args, userId) {
    const { rating } = args;
    if (!rating) throw new Error('Please enter a rating');
    const ratingIsInvalid = rating < 0 || rating > 5;
    if (ratingIsInvalid) {
      throw new Error('Please enter a rating between 0 and 5');
    }
    const existingRating = await GeneralService.findOne(Rating, ({
      $and: [{ reviewer: userId },
        { article: args.articleId }]
    }));
    if (existingRating) throw new Error('You have already rated this article');
  }

  /**
   *
   * @param {String} args - the argument object
   * @param {String} userId - the user of a validated user in the token
   * @param {String} type - whether like or unlike
   * @returns {null} - null
   */
  static checkIfArgumentIsArticleCommentOrReply(args) {
    let objectArgument;
    let textPlaceholder;
    if (args.articleId) {
      objectArgument = { article: args.articleId };
      textPlaceholder = 'article';
    }
    if (args.commentId) {
      objectArgument = { comment: args.commentId };
      textPlaceholder = 'comment';
    }
    if (args.replyId) {
      objectArgument = { reply: args.replyId };
      textPlaceholder = 'reply';
    }
    return { objectArgument, textPlaceholder };
  }

  /**
   *
   * @param {String} args - the argument object
   * @param {String} userId - the user of a validated user in the token
   * @param {String} type - whether like or unlike
   * @returns {null} - null
   */
  static async validateLike(args, userId, type) {
    const result = ArticleHelperClass
      .checkIfArgumentIsArticleCommentOrReply(args);
    const existingRating = await GeneralService.findOne(Like, ({
      $and: [{ reviewer: userId },
        result.objectArgument
      ]
    }));

    if (type === 'like' && existingRating) {
      throw new Error(`You have already liked this ${result.textPlaceholder}`);
    }
    if (type === 'unlike' && !existingRating) {
      throw new Error(`You haven't liked this ${result.textPlaceholder}`);
    }
    if (type === 'unlike' && existingRating) {
      return existingRating._id;
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

  /**
   * @param {String} reportType - the type of report
   * @param {Object} result - object containing userId and articleId
   * @returns {null} - null
   */
  static async validateReport(reportType, result) {
    try {
      if (!reportType) throw new Error('report Type is required');
      const existingReport = await GeneralService.findOne(Report, ({
        $and: [{ reporter: result.userId },
          { article: result.savedArticle._id }]
      }));
      if (existingReport) {
        throw new Error('You have already reported this article');
      }
      const reportTypeEnum = ['spam', 'harassment', 'violation'];
      if (reportTypeEnum.indexOf(reportType.toLowerCase()) === -1) {
        throw new Error('Report type should be one'
        + ' of spam, harassment or violation');
      }
    } catch (error) {
      throw error;
    }
  }
}

export default ArticleHelperClass;
