import GeneralHelperClass from '../helper/GeneralHelperClass';

/**
 * it handles all general database calls
 */
class GeneralService {
  /**
   * creates a new user
   * @param {Object} Model - the database model
    * @param {Object} modelObject - object containing parameters to be created
    * @returns {Object} savedUser
    */
  static async create(Model, modelObject) {
    try {
      const model = new Model(modelObject);
      const savedModel = await model.save();
      return savedModel;
    } catch (error) {
      GeneralHelperClass.handleModelValidationErrors(error);
    }
  }

  /**
   * finds and updates a model by Id
   * @param {Object} Model - the database model
    * @param {Object} identifier - field used to identify parameter in db
    * @param {Object} fieldObjectToBeUpdated - the field to be updated
    * @param {String} type - pull or push
    * @returns {null} returns null
    */
  static async findOneAndUpdate(Model,
    identifier, fieldObjectToBeUpdated,
    type) {
    try {
      if (type === 'pull') {
        await Model.findOneAndUpdate(identifier,
          { $pull: fieldObjectToBeUpdated });
      } else {
        await Model.findOneAndUpdate(identifier,
          { $push: fieldObjectToBeUpdated });
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * find a model
   * @param {String} Model - database model
   * @param {Object} parameterToBeFound - what is being looked for
    * @returns {Object} user object or empty object
    */
  static async findOne(Model, parameterToBeFound) {
    try {
      const model = await Model.findOne(parameterToBeFound);
      return model;
    } catch (error) {
      throw error;
    }
  }

  /**
   * deletes a document
   * @param {String} Model - database model
   * @param {Object} identifier - used to identify database resource
    * @returns {Object} user object or empty object
    */
  static async delete(Model, identifier) {
    try {
      await Model.deleteOne(identifier);
    } catch (error) {
      throw error;
    }
  }
}

export default GeneralService;
