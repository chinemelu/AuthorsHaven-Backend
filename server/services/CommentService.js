import Comment from '../models/comments';
import Reply from '../models/reply';
import Article from '../models/article';
import Like from '../models/like';
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

  /**
   * likes a comment
    * @param {Object} likeCommentObject - object containing the like parameters
    * @returns {Null} null
    */
  static async likeComment(likeCommentObject) {
    let session = null;
    try {
      session = await GeneralService.startTransaction(Comment, session);
      const createLikeObject = {
        comment: likeCommentObject.comment,
        reviewer: likeCommentObject.reviewer,
        article: likeCommentObject.article,
      };
      const createdLike = await GeneralService
        .create(Like, createLikeObject);
      await GeneralService
        .findOneAndUpdate(Comment, {
          _id: likeCommentObject.comment
        }, { 'meta.likes': 1 }, 'increment');
      await GeneralService
        .findOneAndUpdate(Comment, {
          _id: likeCommentObject.comment
        }, { likes: createdLike._id });
      await GeneralService.commitTransaction(session);
      return createdLike;
    } catch (error) {
      await GeneralService.abortTransaction(session);
      throw new Error(error.errors.body.message);
    }
  }

  /**
   * likes a reply
    * @param {Object} likeReplyObject - object containing the like parameters
    * @returns {Null} null
    */
  static async likeReply(likeReplyObject) {
    let session = null;
    try {
      session = await GeneralService.startTransaction(Reply, session);
      const createLikeObject = {
        reply: likeReplyObject.reply,
        reviewer: likeReplyObject.reviewer,
        article: likeReplyObject.article,
      };
      const createdLike = await GeneralService
        .create(Like, createLikeObject);
      await GeneralService
        .findOneAndUpdate(Reply, {
          _id: likeReplyObject.reply
        }, { 'meta.likes': 1 }, 'increment');
      await GeneralService
        .findOneAndUpdate(Reply, {
          _id: likeReplyObject.reply
        }, { likes: createdLike._id });
      await GeneralService.commitTransaction(session);
      return createdLike;
    } catch (error) {
      await GeneralService.abortTransaction(session);
      throw new Error(error.errors.body.message);
    }
  }
}

export default CommentService;
