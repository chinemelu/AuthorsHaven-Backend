import Comment from '../models/comments';
import Reply from '../models/reply';
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
    * @returns {Object} returns created comment
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

  /**
   * finds reply by id
    * @param {String} id - the id of the comment
    * @returns {null} returns null
    */
  static async findCommentById(id) {
    try {
      const savedComment = await Comment.findById(id);
      return savedComment;
    } catch (error) {
      throw error;
    }
  }

  /**
   * finds and updates a comment by Id
    * @param {String} id - id property of article
    * @param {Object} fieldObjectToBeUpdated - the field to be updated
    * @returns {null} returns null
    */
  static async findOneAndUpdate(id, fieldObjectToBeUpdated) {
    const updatedComment = await Comment.findOneAndUpdate({ _id: id },
      { $push: fieldObjectToBeUpdated });
    return updatedComment;
  }

  /**
   * creates reply
    * @param {Object} replyObject - the object containing reply parameters
    * @returns {Object} returns created reply
    */
  static async createReply(replyObject) {
    let session = null;
    try {
      await Reply.createCollection();
      const _session = await Reply.startSession();
      session = _session;
      session.startTransaction();
      const createdReply = await Reply.create([{
        body: replyObject.body,
        author: replyObject.author,
        commentId: replyObject.commentId
      }], { session });
      const reply = {
        _id: createdReply[0]._id,
      };
      await CommentService
        .findOneAndUpdate(replyObject.commentId, { replies: reply });
      await session.commitTransaction();
      session.endSession();
      return createdReply;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(error.errors.body.message);
    }
  }
}

export default CommentService;
