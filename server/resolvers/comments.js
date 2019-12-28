import CommentService from '../services/CommentService';
import CommentHelperClass from '../helper/CommentHelperClass';
import ArticleHelperClass from '../helper/ArticleHelperClass';

/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */

/**
 * @Object Comment Resolver
 */
const CommentResolver = {
  addComment: async (args) => {
    try {
      args = args.commentInput;
      const result = await ArticleHelperClass
        .validateInput(args.token, args.articleId);
      const addedComment = await CommentService.create({
        articleId: args.articleId,
        body: args.commentBody,
        author: result.userId
      });
      return addedComment[0];
    } catch (error) {
      throw error;
    }
  },
  addReplyToComment: async (args) => {
    try {
      const userId = await CommentHelperClass
        .validateCommentFields(args, 'comment');
      const addedReply = await CommentService.replyToComment({
        body: args.replyBody,
        author: userId,
        commentId: args.commentId,
        articleId: args.articleId
      });
      return addedReply;
    } catch (error) {
      throw error;
    }
  },
  addReplyToReply: async (args) => {
    try {
      const userId = await CommentHelperClass
        .validateCommentFields(args, 'reply');
      const addedReply = await CommentService.replyToReply({
        body: args.replyBody,
        author: userId,
        replyId: args.replyId,
        articleId: args.articleId
      });
      return addedReply;
    } catch (error) {
      throw error;
    }
  },
  likeComment: async (args) => {
    try {
      const result = await CommentHelperClass
        .validateLikeCommentFields(args, 'comment', 'like');
      await CommentService.likeComment({
        article: args.articleId,
        comment: args.commentId,
        reviewer: result.userId
      });
    } catch (error) {
      throw error;
    }
  },
  unlikeComment: async (args) => {
    try {
      const result = await CommentHelperClass
        .validateLikeCommentFields(args, 'comment', 'unlike');
      await CommentService.unlikeComment({
        article: args.articleId,
        comment: args.commentId,
        reviewer: result.userId,
        existingLikeId: result.existingLikeId
      });
    } catch (error) {
      throw error;
    }
  },
  likeReply: async (args) => {
    try {
      const result = await CommentHelperClass
        .validateLikeCommentFields(args, 'reply', 'like');
      await CommentService.likeReply({
        article: args.articleId,
        reply: args.replyId,
        reviewer: result.userId
      });
    } catch (error) {
      throw error;
    }
  },

  unlikeReply: async (args) => {
    try {
      const result = await CommentHelperClass
        .validateLikeCommentFields(args, 'reply', 'unlike');
      await CommentService.unlikeReply({
        article: args.articleId,
        reply: args.replyId,
        reviewer: result.userId,
        existingLikeId: result.existingLikeId
      });
    } catch (error) {
      throw error;
    }
  }
};

export default CommentResolver;
