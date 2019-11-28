import ArticleService from '../services/ArticleService';
import CommentService from '../services/CommentService';
import UserHelperClass from '../helper/UserHelperClass';
import TokenHelperClass from '../helper/TokenHelperClass';
import ArticleHelperClass from '../helper/ArticleHelperClass';

/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */

/**
 * @Object ArticleResolver
 */
const ArticleResolver = {
  createArticle: async (args) => {
    try {
      args = args.articleInput;
      const isTokenValid = TokenHelperClass.validateToken(args.token);
      const { userId } = isTokenValid.decodedToken;
      await UserHelperClass.validateUser(userId);
      const newArticle = await ArticleService.create({
        title: args.title,
        body: args.body,
        authorId: userId
      });
      return { ...newArticle._doc };
    } catch (error) {
      throw error;
    }
  },
  readArticle: async (args) => {
    try {
      const savedArticle = await ArticleHelperClass.validateArticle(args.id);
      return { ...savedArticle._doc };
    } catch (error) {
      throw error;
    }
  },
  updateArticle: async (args) => {
    try {
      args = args.articleInput;
      const isTokenValid = TokenHelperClass.validateToken(args.token);
      const { userId } = isTokenValid.decodedToken;
      const savedArticle = await ArticleHelperClass.validateArticle(args._id);
      await UserHelperClass.validateUser(userId);
      const userCanUpdateArticle = await UserHelperClass
        .hasAccess(savedArticle.author.toString(), userId);
      if (!userCanUpdateArticle) throw new Error("You don't have write access");
      await ArticleService.update({ _id: args._id }, {
        title: args.title || savedArticle.title,
        body: args.body || savedArticle.body,
        images: args.images || savedArticle.images
      });
    } catch (error) {
      throw error;
    }
  },
  deleteArticle: async (args) => {
    try {
      args = args.articleInput;
      const isTokenValid = TokenHelperClass.validateToken(args.token);
      const { userId } = isTokenValid.decodedToken;
      const savedArticle = await ArticleHelperClass.validateArticle(args._id);
      await UserHelperClass.validateUser(userId);
      const userCanDeleteArticle = await UserHelperClass
        .hasAccess(savedArticle.author.toString(), userId);
      if (!userCanDeleteArticle) throw new Error("You don't have write access");
      await ArticleService.delete(args._id);
    } catch (error) {
      throw error;
    }
  },
  addComment: async (args) => {
    try {
      args = args.commentInput;
      const isTokenValid = TokenHelperClass.validateToken(args.token);
      const { userId } = isTokenValid.decodedToken;
      await ArticleHelperClass.validateArticle(args.articleId);
      await UserHelperClass.validateUser(userId);
      const commentObject = {
        articleId: args.articleId,
        body: args.commentBody,
        author: userId
      };
      const addedComment = await CommentService.create(commentObject);
      return addedComment[0];
    } catch (error) {
      throw error;
    }
  },
  addReplyToComment: async (args) => {
    try {
      args = args.replyInput;
      const isTokenValid = TokenHelperClass.validateToken(args.token);
      const { userId } = isTokenValid.decodedToken;
      await ArticleHelperClass.validateArticle(args.articleId);
      await ArticleHelperClass.validateComment(args.commentId);
      await UserHelperClass.validateUser(userId);
      const replyObject = {
        body: args.replyBody,
        author: userId,
        commentId: args.commentId,
        articleId: args.articleId
      };
      const addedReply = await CommentService.replyToComment(replyObject);
      return addedReply[0];
    } catch (error) {
      throw error;
    }
  },
  addReplyToReply: async (args) => {
    try {
      args = args.replyInput;
      const isTokenValid = TokenHelperClass.validateToken(args.token);
      const { userId } = isTokenValid.decodedToken;
      await ArticleHelperClass.validateArticle(args.articleId);
      await ArticleHelperClass.validateReply(args.replyId);
      await UserHelperClass.validateUser(userId);
      const replyObject = {
        body: args.replyBody,
        author: userId,
        replyId: args.replyId,
        articleId: args.articleId
      };
      const addedReply = await CommentService.replyToReply(replyObject);
      return addedReply[0];
    } catch (error) {
      throw error;
    }
  }
};

export default ArticleResolver;
