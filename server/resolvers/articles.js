import ArticleService from '../services/ArticleService';
import GeneralService from '../services/GeneralService';
import CommentService from '../services/CommentService';
import UserHelperClass from '../helper/UserHelperClass';
import ArticleHelperClass from '../helper/ArticleHelperClass';
import Article from '../models/article';
import GeneralHelperClass from '../helper/GeneralHelperClass';

/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */

/**
 * @Object ArticleResolver
 */
const ArticleResolver = {
  createArticle: async (args) => {
    try {
      args = args.articleInput;
      const userId = await UserHelperClass.validateUser(args.token);
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
      const userId = await UserHelperClass.validateUser(args.token);
      const savedArticle = await ArticleHelperClass.validateArticle(args._id);
      const userCanUpdateArticle = await UserHelperClass
        .hasAccess(savedArticle.author.toString(), userId);
      if (!userCanUpdateArticle) throw new Error("You don't have write access");
      await GeneralService.update(Article, { _id: args._id }, {
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
      const userId = await UserHelperClass.validateUser(args.token);
      const savedArticle = await ArticleHelperClass.validateArticle(args._id);
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
      const userId = await UserHelperClass.validateUser(args.token);
      await ArticleHelperClass.validateArticle(args.articleId);
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
      const userId = await GeneralHelperClass
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
      args = args.replyInput;
      const userId = await GeneralHelperClass
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
  }
};

export default ArticleResolver;
