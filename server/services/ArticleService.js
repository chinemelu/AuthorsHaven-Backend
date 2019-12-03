import Article from '../models/article';
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

  // /**
  //  * updates an article by Id
  //   * @param {Object} identifier - property used to identify article
  //   * @param {Object} toBeUpdated - property to be updated
  //   * @returns {Object} updatedArticle
  //   */
  // static async update(identifier, toBeUpdated) {
  //   try {
  //     await Article.updateOne(identifier, toBeUpdated);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

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

  // /**
  //  * finds and updates an article by Id
  //   * @param {String} id - id property of article
  //   * @param {Object} fieldObjectToBeUpdated - the field to be updated
  //   * @returns {null} returns null
  //   */
  // static async findOneAndUpdate(id, fieldObjectToBeUpdated) {
  //   try {
  //     await Article.findOneAndUpdate({ _id: id },
  //       { $push: fieldObjectToBeUpdated });
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

export default ArticleService;
