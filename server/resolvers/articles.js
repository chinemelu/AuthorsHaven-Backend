import ArticleService from '../services/ArticleService';
import GeneralService from '../services/GeneralService';
import CommentService from '../services/CommentService';
import UserHelperClass from '../helper/UserHelperClass';
import ArticleHelperClass from '../helper/ArticleHelperClass';
import Article from '../models/article';
import constants from '../constants';

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
      args = args.updateArticleInput;
      const type = {
        HAS_ACCESS: constants.articleEnums.HAS_ACCESS
      };
      const result = await ArticleHelperClass
        .validateInput(args.token, args._id, type);

      await GeneralService.update(Article, { _id: args._id }, {
        title: args.title || result.savedArticle.title,
        body: args.body || result.savedArticle.body,
        images: args.images || result.savedArticle.images,
        meta: {
          timeToRead: UserHelperClass.timeToReadArticle(args.body)
        }
      });
    } catch (error) {
      throw error;
    }
  },
  deleteArticle: async (args) => {
    try {
      args = args.deleteArticleInput;
      const type = {
        HAS_ACCESS: constants.articleEnums.HAS_ACCESS
      };
      await ArticleHelperClass
        .validateInput(args.token, args._id, type);
      await ArticleService.delete(args._id);
    } catch (error) {
      throw error;
    }
  },
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
  createBookmark: async (args) => {
    try {
      const type = {
        BOOKMARK: constants.articleEnums.BOOKMARK
      };
      const result = await ArticleHelperClass
        .validateInput(
          args.token,
          args.articleId,
          type,
          constants.bookmarkEnums.CREATE
        );
      const bookmarkObject = {
        article: args.articleId,
        owner: result.userId
      };
      const createdBookmark = await ArticleService
        .createBookmark(bookmarkObject);
      return createdBookmark;
    } catch (error) {
      throw error;
    }
  },
  deleteBookmark: async (args) => {
    try {
      const type = {
        BOOKMARK: constants.articleEnums.BOOKMARK
      };
      const result = await ArticleHelperClass
        .validateInput(
          args.token,
          args.articleId,
          type,
          constants.bookmarkEnums.DELETE
        );
      const deletedBookmark = await ArticleService
        .deleteBookmark(result.userId, args.articleId);
      return deletedBookmark;
    } catch (error) {
      throw error;
    }
  },
  createRating: async (args) => {
    try {
      const result = await ArticleHelperClass
        .validateInput(
          args.token,
          args.articleId,
          constants.bookmarkEnums.DELETE
        );
    } catch (error) {
      throw error;
    }
  }
};

export default ArticleResolver;
