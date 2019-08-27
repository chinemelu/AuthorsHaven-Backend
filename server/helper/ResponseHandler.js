/**
 * handles responses
 */
class ResponseHandler {
/**
 * @param {Number} statusCode
 * @param {String} errorMessage
 * @param {Object} res - response object
 * @returns {Object} - response object
 */
  static error(statusCode, errorMessage, res) {
    return res.status(statusCode).json({
      error: `${errorMessage}`,
      status: statusCode
    });
  }

  /**
 * @param {Number} statusCode
 * @param {Object} successMessage - success message
 * @param {Object} res - response object
 * @returns {Object} - response object
 */
  static success(statusCode, successMessage, res) {
    return res.status(statusCode).json({
      message: successMessage,
      status: statusCode
    });
  }
}

export default ResponseHandler;
