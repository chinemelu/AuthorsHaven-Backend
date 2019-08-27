import sanitizeNameInput from './sanitizeNameInput';

/**
 * @class sanitizeInputData
 */
class santizeInputData {
  /**
 * @param {string} username - inputted username
 * @return {string} sanitized username
 */
  static username(username) {
    const sanitizedUsername = username.trim().toLowerCase();
    return sanitizedUsername;
  }

  /**
   * @param {string} firstname - inputted first name
   * @return {string} sanitized firstname
   */
  static firstname(firstname) {
    return sanitizeNameInput(firstname);
  }

  /**
 * @param {string} lastname - inputted last name
 * @return {string} sanitized last name
 */
  static lastname(lastname) {
    return sanitizeNameInput(lastname);
  }

  /**
 * @param {string} password - inputted password
 * @return {string} sanitized password
*/
  static password(password) {
    const sanitizedPassword = password.trim();
    return sanitizedPassword;
  }

  /**
 * @param {string} email - inputted email
 * @return {string} sanitized email
 */
  static email(email) {
    const sanitizedEmail = email.trim().toLowerCase();
    return sanitizedEmail;
  }
}

export default santizeInputData;
