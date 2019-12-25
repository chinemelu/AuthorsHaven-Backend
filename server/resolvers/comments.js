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
      const userId = await CommentHelperClass
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
      const userId = await CommentHelperClass
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
      const userId = await CommentHelperClass
        .validateLikeCommentFields(args, 'comment', 'like');
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
      const userId = await CommentHelperClass
        .validateLikeCommentFields(args, 'reply', 'like');
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
