import CommentService from '../services/CommentService';
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
      const commentObject = {
        articleId: args.articleId,
        body: args.commentBody,
        author: result.userId
      };
      const addedComment = await CommentService.create(commentObject);
      return addedComment[0];
    } catch (error) {
      throw error;
    }
  },
  addReplyToComment: async (args) => {
    try {
      args = args.replyToCommentInput;
      const userId = await ArticleHelperClass
        .validateCommentFields(args, 'comment');
      const replyObject = {
        body: args.replyBody,
        author: userId,
        commentId: args.commentId,
        articleId: args.articleId
      };
      const addedReply = await CommentService.replyToComment(replyObject);
      return addedReply;
    } catch (error) {
      throw error;
    }
  },
  addReplyToReply: async (args) => {
    try {
      args = args.replyToReplyInput;
      const userId = await ArticleHelperClass
        .validateCommentFields(args, 'reply');
      const replyObject = {
        body: args.replyBody,
        author: userId,
        replyId: args.replyId,
        articleId: args.articleId
      };
      const addedReply = await CommentService.replyToReply(replyObject);
      return addedReply;
    } catch (error) {
      throw error;
    }
  },
  likeComment: async (args) => {
    try {
      const userId = await ArticleHelperClass
        .validateCommentFields(args, 'comment');
      await ArticleHelperClass.validateLike(args, userId, 'like');
      const likeCommentObject = {
        article: args.articleId,
        comment: args.commentId,
        reviewer: userId
      };
      await CommentService.likeComment(likeCommentObject);
    } catch (error) {
      throw error;
    }
  },
  likeReply: async (args) => {
    try {
      const userId = await ArticleHelperClass
        .validateCommentFields(args, 'reply');
      await ArticleHelperClass.validateLike(args, userId, 'like');
      const likeReplyObject = {
        article: args.articleId,
        reply: args.replyId,
        reviewer: userId
      };
      await CommentService.likeReply(likeReplyObject);
    } catch (error) {
      throw error;
    }
  },
};

export default CommentResolver;
