
/* eslint no-underscore-dangle:
 ["error", { "allow": ["_id", "_doc", "_session"] }] */
/**

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
      throw new Error(error);
      // GeneralHelperClass.handleModelValidationErrors(error);
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

  /**
   * starts a transaction
   * @param {String} Model - database model
   * @param {Object} session - transaction session
    * @returns {Object} user object or empty object
    */
  static async startTransaction(Model, session) {
    const _session = await Model.startSession();
    session = _session;
    session.startTransaction();
    return session;
  }

  /**
   * commits a transaction
   * @param {Object} session - transaction session
    * @returns {null} null
    */
  static async commitTransaction(session) {
    await session.commitTransaction();
    session.endSession();
  }

  /**
   * aborts a transaction
   * @param {Object} session - transaction session
    * @returns {null} null
    */
  static async abortTransaction(session) {
    await session.abortTransaction();
    session.endSession();
  }

  /**
   * checks if a document exists
   * @param {Object} Model - the database model
    * @param {String} id - the id of the resource being check
    * @returns {Object} user object or empty object
    */
  static async findById(Model, id) {
    try {
      const savedModel = await Model.findById(id);
      return savedModel;
    } catch (error) {
      throw error;
    }
  }

  /**
   * updates a model
   * @param {Object} Model - database model
    * @param {Object} identifier - the parameter used to identify the db entity
    * @param {Object} toBeUpdated - the parameter to be updated on the database
    * @returns {Object} user object or empty object
    */
  static async update(Model, identifier, toBeUpdated) {
    try {
      await Model.updateOne(identifier, toBeUpdated);
    } catch (error) {
      throw error;
    }
  }
}

export default GeneralService;
