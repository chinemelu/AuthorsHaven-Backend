import ArticleService from '../services/ArticleService';
import CommentService from '../services/CommentService';
import UserService from '../services/UserService';
import GeneralHelperClass from '../helper/GeneralHelperClass';
import UserHelperClass from '../helper/UserHelperClass';
import TokenHelperClass from '../helper/TokenHelperClass';

/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */

/**
 * @Object ArticleResolver
 */
const ArticleResolver = {
  createArticle: async (args) => {
    try {
      args = args.articleInput;
      if (!args.token) throw new Error('No token provided');
      const isTokenValid = TokenHelperClass.verifyToken(args.token);
      if (isTokenValid.error) throw new Error('Invalid token');
      const { userId } = isTokenValid.decodedToken;
      const savedUser = await UserService
        .findById(userId);
      const isIdValid = GeneralHelperClass.isIdValid(userId);
      if (!isIdValid) throw new Error('Invalid authorId');
      if (savedUser === null) throw new Error('User does not exist');
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
      if (!args.token) throw new Error('No token provided');
      const isTokenValid = TokenHelperClass.verifyToken(args.token);
      if (isTokenValid.error) throw new Error('Invalid token');
      const { userId } = isTokenValid.decodedToken;
      const savedUser = await UserService.findById(userId);
      const isAuthorIdValid = GeneralHelperClass.isIdValid(userId);
      const isArticleIdValid = GeneralHelperClass.isIdValid(args._id);
      const savedArticle = await ArticleService.findById(args._id);
      if (!isAuthorIdValid) throw new Error('Invalid authorId');
      if (!isArticleIdValid) throw new Error('Article Id is invalid');
      if (savedUser === null) throw new Error('User does not exist');
      if (savedArticle === null) throw new Error('Article does not exist');
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
      if (!args.token) throw new Error('No token provided');
      const isTokenValid = TokenHelperClass.verifyToken(args.token);
      if (isTokenValid.error) throw new Error('Invalid token');
      const { userId } = isTokenValid.decodedToken;
      const savedUser = await UserService.findById(userId);
      const isAuthorIdValid = GeneralHelperClass.isIdValid(userId);
      const isArticleIdValid = GeneralHelperClass.isIdValid(args._id);
      const savedArticle = await ArticleService.findById(args._id);
      if (!isAuthorIdValid) throw new Error('Invalid authorId');
      if (!isArticleIdValid) throw new Error('Article Id is invalid');
      if (savedUser === null) throw new Error('User does not exist');
      if (savedArticle === null) throw new Error('Article does not exist');
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
      if (!args.token) throw new Error('No token provided');
      const isTokenValid = TokenHelperClass.verifyToken(args.token);
      if (isTokenValid.error) throw new Error('Invalid token');
      const { userId } = isTokenValid.decodedToken;
      const savedUser = await UserService.findById(userId);
      const isAuthorIdValid = GeneralHelperClass.isIdValid(userId);
      if (!args.articleId) throw new Error('Article Id is required');
      const isArticleIdValid = GeneralHelperClass.isIdValid(args.articleId);
      const savedArticle = await ArticleService.findById(args.articleId);
      if (!isAuthorIdValid) throw new Error('Invalid authorId');
      if (!isArticleIdValid) throw new Error('Article Id is invalid');
      if (savedUser === null) throw new Error('User does not exist');
      if (savedArticle === null) throw new Error('Article does not exist');
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
  addReply: async (args) => {
    try {
      args = args.replyInput;
      if (!args.token) throw new Error('No token provided');
      const isTokenValid = TokenHelperClass.verifyToken(args.token);
      if (isTokenValid.error) throw new Error('Invalid token');
      const { userId } = isTokenValid.decodedToken;
      const savedUser = await UserService.findById(userId);
      const isAuthorIdValid = GeneralHelperClass.isIdValid(userId);
      if (!args.commentId) throw new Error('Comment Id is required');
      const savedComment = await CommentService.findCommentById(args.commentId);
      if (!isAuthorIdValid) throw new Error('Invalid authorId');
      if (savedUser === null) throw new Error('User does not exist');
      if (savedComment === null) throw new Error('Comment does not exist');
      const replyObject = {
        body: args.replyBody,
        author: userId,
        commentId: args.commentId
      };
      const addedReply = await CommentService.createReply(replyObject);
      return addedReply[0];
    } catch (error) {
      throw error;
    }
  }
};

export default ArticleResolver;
