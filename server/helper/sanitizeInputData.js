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
    username = username.trim().toLowerCase();
    return username;
  }

  /**
   * @param {string} firstname - inputted first name
   * @return {string} sanitized firstname
   */
  static firstname(firstname) {
    const sanitizedNameProperty = sanitizeNameInput(firstname);
    return sanitizedNameProperty;
  }

  /**
 * @param {string} lastname - inputted last name
 * @return {string} sanitized last name
 */
  static lastname(lastname) {
    const sanitizedNameProperty = sanitizeNameInput(lastname);
    return sanitizedNameProperty;
  }

  /**
 * @param {string} password - inputted password
 * @return {string} sanitized password
*/
  static password(password) {
    password = password.trim();
    return password;
  }

  /**
 * @param {string} email - inputted email
 * @return {string} sanitized email
 */
  static email(email) {
    const newEmail = email.trim().toLowerCase();
    return newEmail;
  }
}


export default santizeInputData;
