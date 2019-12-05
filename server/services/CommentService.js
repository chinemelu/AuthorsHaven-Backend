import Comment from '../models/comments';
import Reply from '../models/reply';
import Article from '../models/article';
import GeneralService from './GeneralService';

/* eslint no-underscore-dangle:
 ["error", { "allow": ["_id", "_doc", "_session"] }] */

/**
 * it handles all database calls with respect to an article
 */
class CommentService {
  /**
   * finds and updates an article by Id
    * @param {Object} commentObject - the object containing comment parameters
    * @returns {Object} returns created comment
    */
  static async create(commentObject) {
    let session = null;
    try {
      session = await GeneralService.startTransaction(Comment, session);
      const createdComment = await Comment.create([{
        body: commentObject.body,
        author: commentObject.author,
        article: commentObject.articleId
      }]);

      const comments = {
        _id: createdComment[0]._id,
      };
      await GeneralService
        .findOneAndUpdate(Article, commentObject.articleId, { comments });
      await GeneralService.commitTransaction(session);
      return createdComment;
    } catch (error) {
      GeneralService.abortTransaction(session);
      throw new Error(error.errors.body.message);
    }
  }

  /**
   * creates reply
    * @param {Object} replyObject - the object containing reply parameters
    * @returns {Object} returns created reply
    */
  static async replyToComment(replyObject) {
    let session = null;
    try {
      session = await GeneralService.startTransaction(Reply, session);
      const createReplyObject = {
        body: replyObject.body,
        author: replyObject.author,
        comment: replyObject.commentId,
        article: replyObject.articleId
      };
      const createdReply = await GeneralService
        .create(Reply, createReplyObject);

      const reply = {
        _id: createdReply._id,
      };
      await GeneralService
        .findOneAndUpdate(Comment, replyObject.commentId, { replies: reply });
      await GeneralService.commitTransaction(session);
      return createdReply;
    } catch (error) {
      await GeneralService.abortTransaction(session);
      throw new Error(error.errors.body.message);
    }
  }

  /**
   * creates reply
    * @param {Object} replyObject - the object containing reply parameters
    * @returns {Object} returns created reply
    */
  static async replyToReply(replyObject) {
    let session = null;
    try {
      session = await GeneralService.startTransaction(Reply, session);
      const createReplyObject = {
        body: replyObject.body,
        author: replyObject.author,
        comment: replyObject.replyId,
        article: replyObject.articleId
      };
      const createdReply = await GeneralService
        .create(Reply, createReplyObject);
      const reply = {
        _id: createdReply._id,
      };
      await GeneralService
        .findOneAndUpdate(Reply, replyObject.replyId, { replies: reply });
      await GeneralService.commitTransaction(session);
      return createdReply;
    } catch (error) {
      await GeneralService.abortTransaction(session);
      throw new Error(error.errors.body.message);
    }
  }
}

export default CommentService;
