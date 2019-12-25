import Bookmark from '../models/bookmark';
import UserProfile from '../models/userProfile';
import GeneralService from './GeneralService';

/* eslint no-underscore-dangle:
 ["error", { "allow": ["_id", "_doc", "_session"] }] */

/**
 * it handles all database calls with respect to a bookmark
 */
class BookmarkService {
  /**
   * creates bookmark
    * @param {Object} bookmarkObject - the object containing reply parameters
    * @returns {Object} returns created reply
    */
  static async createBookmark(bookmarkObject) {
    let session = null;
    try {
      session = await GeneralService.startTransaction(Bookmark, session);
      const createBookmarkObject = {
        owner: bookmarkObject.owner,
        article: bookmarkObject.article
      };
      const createdBookmark = await GeneralService
        .create(Bookmark, createBookmarkObject);

      const bookmark = {
        _id: bookmarkObject.article
      };

      await GeneralService
        .findOneAndUpdate(UserProfile, {
          owner: bookmarkObject.owner
        }, { bookmarks: bookmark });
      await GeneralService.commitTransaction(session);
      return createdBookmark;
    } catch (error) {
      await GeneralService.abortTransaction(session);
      throw new Error(error.errors.body.message);
    }
  }

  /**
   * removes bookmark
   * @param {String} userId - the id of the user in the token
   * @param {String} articleId - the id of the article in the bookmark
    * @param {Object} bookmarkObject - the object containing reply parameters
    * @returns {Object} returns created reply
    */
  static async deleteBookmark(userId, articleId) {
    let session = null;
    try {
      session = await GeneralService.startTransaction(Bookmark, session);
      const createdBookmark = await GeneralService
        .delete(Bookmark, ({
          $and: [{ owner: userId },
            { article: articleId }]
        }));

      await GeneralService
        .findOneAndUpdate(UserProfile, {
          owner: userId
        }, { bookmarks: articleId }, 'pull');
      await GeneralService.commitTransaction(session);
      return createdBookmark;
    } catch (error) {
      await GeneralService.abortTransaction(session);
      throw new Error(error.errors.body.message);
    }
  }
}

export default BookmarkService;
