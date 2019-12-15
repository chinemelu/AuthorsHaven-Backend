import Article from '../models/article';
import Bookmark from '../models/bookmark';
import Rating from '../models/rating';
import Like from '../models/like';
import UserProfile from '../models/userProfile';
import GeneralService from './GeneralService';
import GeneralHelperClass from '../helper/GeneralHelperClass';

/* eslint no-underscore-dangle:
 ["error", { "allow": ["_id", "_doc", "_session"] }] */

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
            populate: { path: 'replies', populate: { path: 'replies' } }
          }
        )
        .populate({
          path: 'ratings',
          model: 'Rating',
          populate: { path: 'reviewer', model: 'User' }
        });
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

  /**
   * creates bookmark
    * @param {Object} ratingObject - the object containing rating parameters
    * @returns {Null} null
    */
  static async createRating(ratingObject) {
    let session = null;
    try {
      session = await GeneralService.startTransaction(Bookmark, session);
      const createRatingObject = {
        reviewer: ratingObject.reviewer,
        article: ratingObject.article,
        rating: ratingObject.rating
      };
      const createdRating = await GeneralService
        .create(Rating, createRatingObject);
      const rating = {
        _id: createdRating._id
      };

      await GeneralService
        .findOneAndUpdate(Article, {
          _id: ratingObject.article
        }, { ratings: rating });
      await GeneralService.commitTransaction(session);
      return createdRating;
    } catch (error) {
      await GeneralService.abortTransaction(session);
      throw new Error(error.errors.body.message);
    }
  }

  /**
   * add a like to an article
    * @param {Object} likeObject - the object containing like parameters
    * @returns {Null} null
    */
  static async addLikeToArticle(likeObject) {
    let session = null;
    try {
      session = await GeneralService.startTransaction(Bookmark, session);
      const createLikeObject = {
        reviewer: likeObject.reviewer,
        article: likeObject.article,
      };
      const createdLike = await GeneralService
        .create(Like, createLikeObject);
      await GeneralService
        .findOneAndUpdate(Article, {
          _id: likeObject.article
        }, { 'meta.likes': 1 }, 'increment');
      await GeneralService.commitTransaction(session);
      return createdLike;
    } catch (error) {
      await GeneralService.abortTransaction(session);
      throw new Error(error.errors.body.message);
    }
  }
}

export default ArticleService;
