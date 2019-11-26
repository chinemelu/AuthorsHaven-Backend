import Comment from '../models/comments';
import ArticleService from './ArticleService';

/* eslint no-underscore-dangle:
 ["error", { "allow": ["_id", "_doc", "_session"] }] */

/**
 * it handles all database calls with respect to an article
 */
class CommentService {
  /**
   * finds and updates an article by Id
    * @param {Object} commentObject - the object containing comment parameters
    * @returns {null} returns null
    */
  static async create(commentObject) {
    let session = null;
    try {
      await Comment.createCollection();
      const _session = await Comment.startSession();
      session = _session;
      session.startTransaction();
      const createdComment = await Comment.create([{
        body: commentObject.body,
        author: commentObject.author,
        articleId: commentObject.articleId
      }], { session });
      const comments = {
        _id: createdComment[0]._id,
      };
      await ArticleService
        .findOneAndUpdate(commentObject.articleId, { comments });
      await session.commitTransaction();
      session.endSession();
      return createdComment;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(error.errors.body.message);
    }
  }
}

export default CommentService;
