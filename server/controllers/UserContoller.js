import User from '../models/user';
import ApiResponses from '../helper/ApiResponses';

/**
 * @class UserController
 */
class UserController {
  /**
   * @param {Object} req - request body
   * @param {Object} res - response body
   * @return {Object} error response
   */
  static async signup(req, res) {
    const user = new User({
      username: req.body.username || '',
      firstname: req.body.firstname || '',
      lastname: req.body.lastname || '',
      password: req.body.password || '',
      email: req.body.email || ''
    });
    try {
      const savedUser = await user.save();
      if (savedUser) {
        return ApiResponses.status201(res, savedUser);
      }
    } catch (error) {
      Object.keys(error.errors).forEach((errorProperty) => {
        const errorType = error.errors[errorProperty].kind;
        if (errorType === 'user defined' || errorType === 'required') {
          return ApiResponses.status400(res, error.errors);
        }
        if (error.errors.email && error.errors.email.kind === 'unique') {
          return ApiResponses.status409(res, error.errors.email.message);
        }
        if (error.errors.username && error.errors.username.kind === 'unique') {
          return ApiResponses.status409(res, error.errors.username.message);
        }
        ApiResponses.status500(res, 'Server error');
      });
    }
  }
}

export default UserController;
