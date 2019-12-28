import ArticleHelperClass from './ArticleHelperClass';
import UserHelperClass from './UserHelperClass';
import GeneralService from '../services/GeneralService';
import GeneralHelperClass from './GeneralHelperClass';
import Reply from '../models/reply';
import Comment from '../models/comments';


/* eslint no-underscore-dangle:
 ["error", { "allow": ["_id", "_doc", "_session"] }] */
/**

/**
 * Helper class for all things relating to tokens
 */
class CommentHelperClass {
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
    await CommentHelperClass
      .validateComment(
        type === 'comment' ? args.commentId : args.replyId, type
      );
    return userId;
  }

  /**
   *
   * @param {Object} args - the argument from the graphQL schema
   * @param {String} commentType - whether 'comment' or 'reply'
   * @param {String} likeType -'like' or 'unlike'
   * @returns {String} - the id of a valid user
   */
  static async validateLikeCommentFields(args, commentType, likeType) {
    const userId = await CommentHelperClass
      .validateCommentFields(args, commentType);
    const existingLikeId = await ArticleHelperClass
      .validateLike(args, userId, likeType);
    return { userId, existingLikeId };
  }
}

export default CommentHelperClass;
