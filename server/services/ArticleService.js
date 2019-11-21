import Article from '../models/article';

/**
 * it handles all database calls with respect to an article
 */
class ArticleService {
  /**
   * creates a new article
    * @param {Object} articleObject - the article object
    * @returns {Object} savedArticle
    */
  static async create(articleObject) {
    try {
      const article = new Article({
        title: articleObject.title || '',
        body: articleObject.body || '',
        author: articleObject.authorId || ''
      });
      const savedArticle = await article.save();
      return savedArticle;
    } catch (error) {
      Object.keys(error.errors).forEach((errorProperty) => {
        const errorMessage = error.errors[errorProperty];
        throw new Error(errorMessage);
      });
    }
  }

  /**
   * finds an article by Id
    * @param {Object} id - the article id inputted by the user
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
}

export default ArticleService;
