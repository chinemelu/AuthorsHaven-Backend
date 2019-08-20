import jwt from 'jsonwebtoken';
/**
 * @function createToken creates token
 * @param {String} userId the id of the user
 * @return {String} the token
 */

const createToken = (userId) => {
  try {
    return jwt.sign({
      userId
    }, process.env.JWT_SECRET, { expiresIn: '7h' });
  } catch (err) {
    throw new Error('Error creating token');
  }
};


export default createToken;
