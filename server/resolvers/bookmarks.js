import BookmarkService from '../services/BookmarkService';
import ArticleHelperClass from '../helper/ArticleHelperClass';
import constants from '../constants';

/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */

/**
 * @Object Comment Resolver
 */
const BookmarkResolver = {
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
      const createdBookmark = await BookmarkService
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
      const deletedBookmark = await BookmarkService
        .deleteBookmark(result.userId, args.articleId);
      return deletedBookmark;
    } catch (error) {
      throw error;
    }
  },
};

export default BookmarkResolver;
