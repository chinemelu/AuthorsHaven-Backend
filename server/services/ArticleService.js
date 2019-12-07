import Article from '../models/article';
import Bookmark from '../models/bookmark';
import UserProfile from '../models/userProfile';
import GeneralService from './GeneralService';
import GeneralHelperClass from '../helper/GeneralHelperClass';


/**
 * it handles all database calls with respect to an article
 */
class ArticleService {
  /**
   * creates a new article
    * @param {Object} articleObject - the article object
    * @returns {Object} createdArticle
    */
  static async create(articleObject) {
    try {
      const article = new Article({
        title: articleObject.title,
        body: articleObject.body,
        author: articleObject.authorId
      });
      const createdArticle = await article.save();
      return createdArticle;
    } catch (error) {
      GeneralHelperClass.handleModelValidationErrors(error);
    }
  }

  /**
   * finds an article by Id
    * @param {String} id - the article id inputted by the user
    * @returns {Object} savedArticle
    */
  static async findById(id) {
    try {
      const savedArticle = await Article.findById(id)
        .populate(
          {
            path: 'comments',
            model: 'Comment',
            populate: {
              path: 'replies',
              populate: {
                path: 'replies'
              }
            }
          }
        );
      return savedArticle;
    } catch (error) {
      throw error;
    }
  }

  /**
   * deletes an article by Id
    * @param {String} id - id property of article
    * @returns {null} returns null
    */
  static async delete(id) {
    try {
      await Article.deleteOne({ _id: id });
    } catch (error) {
      throw error;
    }
  }

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

export default ArticleService;
