import ArticleService from '../services/ArticleService';
import UserService from '../services/UserService';
import GeneralHelperClass from '../helper/GeneralHelperClass';


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
  }
};

export default ArticleResolver;
