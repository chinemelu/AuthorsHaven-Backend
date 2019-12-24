import ArticleService from '../services/ArticleService';
import GeneralService from '../services/GeneralService';
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
  createRating: async (args) => {
    try {
      args = args.ratingInput;
      const result = await ArticleHelperClass
        .validateInput(
          args.token,
          args.articleId,
        );
      await ArticleHelperClass.validateRating(args, result.userId);
      const ratingObject = {
        reviewer: result.userId,
        article: args.articleId,
        rating: args.rating
      };
      await ArticleService.createRating(ratingObject);
    } catch (error) {
      throw error;
    }
  },
  addLikeToArticle: async (args) => {
    try {
      const result = await ArticleHelperClass
        .validateInput(
          args.token,
          args.articleId,
        );
      await ArticleHelperClass.validateLike(args, result.userId, 'like');
      const likeObject = {
        article: args.articleId,
        reviewer: result.userId
      };
      await ArticleService.addLikeToArticle(likeObject);
    } catch (error) {
      throw error;
    }
  },
  unlikeArticle: async (args) => {
    try {
      const result = await ArticleHelperClass
        .validateInput(
          args.token,
          args.articleId,
        );
      const existingLikeId = await ArticleHelperClass
        .validateLike(args, result.userId, 'unlike');
      const likeObject = {
        _id: existingLikeId,
        article: args.articleId,
        reviewer: result.userId
      };
      await ArticleService.unlikeArticle(likeObject);
    } catch (error) {
      throw error;
    }
  },
  reportArticle: async (args) => {
    try {
      args = args.reportInput;
      const result = await ArticleHelperClass
        .validateInput(
          args.token,
          args.articleId,
        );
      await ArticleHelperClass.validateReport(args.reportType, result);
      const reportObject = {
        article: args.articleId,
        reporter: result.userId,
        reportType: args.reportType
      };
      const createdReport = await ArticleService.createReport(reportObject);
      return createdReport;
    } catch (error) {
      throw error;
    }
  },
};

export default ArticleResolver;
