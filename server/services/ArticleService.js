import Article from '../models/article';

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
        title: articleObject.title || '',
        body: articleObject.body || '',
        author: articleObject.authorId || ''
      });
      const createdArticle = await article.save();
      return createdArticle;
    } catch (error) {
      Object.keys(error.errors).forEach((errorProperty) => {
        const errorMessage = error.errors[errorProperty];
        throw new Error(errorMessage);
      });
    }
  }

  /**
   * finds an article by Id
    * @param {String} id - the article id inputted by the user
    * @returns {Object} savedArticle
    */
  static async findById(id) {
    try {
      const savedArticle = await Article.findById(id);
      return savedArticle;
    } catch (error) {
      Object.keys(error.errors).forEach((errorProperty) => {
        const errorMessage = error.errors[errorProperty];
        throw new Error(errorMessage);
      });
    }
  }

  /**
   * updates an article by Id
    * @param {Object} identifier - property used to identify article
    * @param {Object} toBeUpdated - property to be updated
    * @returns {Object} updatedArticle
    */
  static async update(identifier, toBeUpdated) {
    try {
      const updatedArticle = await Article.updateOne(identifier, toBeUpdated);
      return updatedArticle;
    } catch (error) {
      Object.keys(error.errors).forEach((errorProperty) => {
        const errorMessage = error.errors[errorProperty];
        throw new Error(errorMessage);
      });
    }
  }

  /**
   * deletes an article by Id
    * @param {String} id - id property of article
    * @returns {null} returns null
    */
  static async delete(id) {
    try {
      const deletedArticle = await Article.deleteOne({ _id: id });
      return deletedArticle;
    } catch (error) {
      Object.keys(error.errors).forEach((errorProperty) => {
        const errorMessage = error.errors[errorProperty];
        throw new Error(errorMessage);
      });
    }
  }
}

export default ArticleService;
