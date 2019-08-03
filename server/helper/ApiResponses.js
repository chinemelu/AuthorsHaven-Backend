/**
 * @class ErrorResponses
 */
class ApiResponses {
  /**
   *  @param {Object} res - response object
   *  @param {string} errorMessage - error message;
   * @return {JSON} response object with error and status
   */
  static status409(res, errorMessage) {
    return res.status(409).json({
      status: 409,
      error: errorMessage
    });
  }

  /**
   *  @param {Object} res - response object
   *  @param {string} errorMessage - error message;
   * @return {JSON} response object with error and status
   */
  static status500(res, errorMessage) {
    return res.status(500).json({
      status: 500,
      error: errorMessage
    });
  }

  /**
   *  @param {Object} res - response object
   *  @param {string} errorMessage - error message;
   * @return {JSON} response object with error and status
   */
  static status400(res, errorMessage) {
    return res.status(400).json({
      status: 400,
      error: errorMessage
    });
  }

  /**
   *  @param {Object} res - response object
   *  @param {string} errorMessage - error message;
   * @return {JSON} response object with error and status
   */
  static status404(res, errorMessage) {
    return res.status(404).json({
      status: 404,
      error: errorMessage
    });
  }

  /**
   *  @param {Object} res - response object
   *  @param {string} data - data to be displayed;
   * @return {JSON} response object with error and status
   */
  static status201(res, data) {
    return res.status(201).json({
      status: 201,
      data
    });
  }
}

export default ApiResponses;
