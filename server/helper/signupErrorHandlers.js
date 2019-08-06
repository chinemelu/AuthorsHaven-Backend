import constants from '../constants';
import ApiResponses from './ApiResponses';

/**
   * @param {Object} res - response object
   * @param {String} errorType - type of error
   * @param {Object} error - error Object
   * @returns {Object} - response object
   */
const signupErrorHandlers = (res, errorType, error) => {
  const conditionsForInvalidParametersError = errorType
     === constants.mongodbValidationErrorType.USERDEFINED
     || errorType === constants.mongodbValidationErrorType.REQUIRED
     || errorType === constants.mongodbValidationErrorType.MAXLENGTH
     || errorType === constants.mongodbValidationErrorType.MINLENGTH;

  if (conditionsForInvalidParametersError) {
    return ApiResponses.status400(res, error.errors);
  }
  const emailOrUsernameProperty = Object.keys(error.errors);

  const conditionsForNotUniqueError = error.errors[emailOrUsernameProperty]
    && error.errors[emailOrUsernameProperty].kind === constants
      .mongodbValidationErrorType.UNIQUE;

  if (conditionsForNotUniqueError) {
    return ApiResponses.status409(res, error.errors[emailOrUsernameProperty]
      .message);
  }
  ApiResponses.status500(res, 'Server error');
};

export default signupErrorHandlers;
