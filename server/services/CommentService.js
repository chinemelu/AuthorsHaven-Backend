import Comment from '../models/comments';
import Reply from '../models/reply';
import ReplyService from './ReplyService';
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
        article: commentObject.articleId
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
   * finds comment by id
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
    try {
      await Comment.findOneAndUpdate({ _id: id },
        { $push: fieldObjectToBeUpdated });
    } catch (error) {
      throw error;
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
      await Reply.createCollection();
      const _session = await Reply.startSession();
      session = _session;
      session.startTransaction();
      const createdReply = await Reply.create([{
        body: replyObject.body,
        author: replyObject.author,
        comment: replyObject.commentId,
        article: replyObject.articleId
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

  /**
   * creates reply
    * @param {Object} replyObject - the object containing reply parameters
    * @returns {Object} returns created reply
    */
  static async replyToReply(replyObject) {
    let session = null;
    try {
      await Reply.createCollection();
      const _session = await Reply.startSession();
      session = _session;
      session.startTransaction();
      const createdReply = await Reply.create([{
        body: replyObject.body,
        author: replyObject.author,
        comment: replyObject.replyId,
        article: replyObject.articleId
      }], { session });
      const reply = {
        _id: createdReply[0]._id,
      };
      await ReplyService
        .findOneAndUpdate(replyObject.replyId, { replies: reply });
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
