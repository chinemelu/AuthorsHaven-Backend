import ArticleService from '../services/ArticleService';
import UserService from '../services/UserService';
import GeneralHelperClass from '../helper/GeneralHelperClass';
import UserHelperClass from '../helper/UserHelperClass';


/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */

/**
 * @Object ArticleResolver
 */
const ArticleResolver = {
  createArticle: async (args) => {
    try {
      args = args.articleInput;
      const savedUser = await UserService.findById(args.authorId);
      const isIdValid = GeneralHelperClass.isIdValid(args.authorId);
      if (!args.authorId) throw new Error('AuthorId is required');
      if (!isIdValid) throw new Error('Invalid authorId');
      if (savedUser === null) throw new Error('User does not exist');
      const newArticle = await ArticleService.create({
        title: args.title,
        body: args.body,
        authorId: args.authorId
      });
      return { ...newArticle._doc };
    } catch (error) {
      throw error;
    }
  },
  readArticle: async (args) => {
    try {
      if (!args.id) throw new Error('ArticleId is required');
      const isIdValid = GeneralHelperClass.isIdValid(args.id);
      if (!isIdValid) throw new Error('Invalid articleId');
      const savedArticle = await ArticleService.findById(args.id);
      if (savedArticle === null) throw new Error('Article does not exist');
      return { ...savedArticle._doc };
    } catch (error) {
      throw error;
    }
  },
  updateArticle: async (args) => {
    try {
      args = args.articleInput;
      const savedUser = await UserService.findById(args.authorId);
      const isAuthorIdValid = GeneralHelperClass.isIdValid(args.authorId);
      const isArticleIdValid = GeneralHelperClass.isIdValid(args._id);
      const savedArticle = await ArticleService.findById(args._id);
      if (!args.authorId) throw new Error('AuthorId is required');
      if (!isAuthorIdValid) throw new Error('Invalid authorId');
      if (!isArticleIdValid) throw new Error('Article Id is invalid');
      if (savedUser === null) throw new Error('User does not exist');
      const userCanUpdateArticle = await UserHelperClass
        .hasAccess(savedArticle.author.toString(), args.authorId);
      if (savedArticle === null) throw new Error('Article does not exist');
      if (!userCanUpdateArticle) throw new Error("You don't have write access");
      const updatedArticle = await ArticleService.update({ _id: args._id }, {
        title: args.title || savedArticle.title,
        body: args.body || savedArticle.body,
        images: args.images || savedArticle.images
      });
      return { ...updatedArticle };
    } catch (error) {
      throw error;
    }
  },
  deleteArticle: async (args) => {
    try {
      args = args.articleInput;
      const savedUser = await UserService.findById(args.authorId);
      const isAuthorIdValid = GeneralHelperClass.isIdValid(args.authorId);
      const isArticleIdValid = GeneralHelperClass.isIdValid(args._id);
      const savedArticle = await ArticleService.findById(args._id);
      if (!args.authorId) throw new Error('AuthorId is required');
      if (!isAuthorIdValid) throw new Error('Invalid authorId');
      if (!isArticleIdValid) throw new Error('Article Id is invalid');
      if (savedUser === null) throw new Error('User does not exist');
      const userCanDeleteArticle = await UserHelperClass
        .hasAccess(savedArticle.author.toString(), args.authorId);
      if (savedArticle === null) throw new Error('Article does not exist');
      if (!userCanDeleteArticle) throw new Error("You don't have write access");
      const deletedArticle = await ArticleService.delete(args._id);
      return { ...deletedArticle };
    } catch (error) {
      throw error;
    }
  }
};

export default ArticleResolver;
