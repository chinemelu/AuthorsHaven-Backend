import sgMail from '@sendgrid/mail';
import TokenHelperClass from './TokenHelperClass';
import ResponseHandler from './ResponseHandler';
import UserService from '../services/UserService';

/**
 * @class EmailHelperClass
 */
class EmailHelperClass {
  /**
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @returns {Boolean} - true if user exists
   */
  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;
      const verifiedToken = TokenHelperClass.verifyToken(token);

      if (verifiedToken.error) {
        return ResponseHandler.error(401, verifiedToken.error, res);
      }
      const { userId } = verifiedToken.decodedToken;
      const foundUser = await UserService.findById(userId);

      EmailHelperClass.emailVerificationValidation(foundUser, res);

      const emailCanBeVerified = EmailHelperClass
        . emailCanBeVerified(foundUser);

      if (emailCanBeVerified) {
        await UserService.update({ _id: userId },
          { isVerified: true }).then(() => {
          ResponseHandler
            .success(200,
              `${foundUser.username} has been successfully verified`, res);
        });
      }
    } catch (error) {
      ResponseHandler.error(500, error, res).send({ error });
    }
  }

  /**
   *
   * @param {String} to - email of receiver
   * @param {String} from - email of sender
   * @param {String} subject - subject of email
   * @param {String} text - text of email
   * @returns {undefined}
   */
  static async sendEmail(to, from, subject, text) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: `${to}`,
      from: `${from}`,
      subject: `${subject}`,
      text: `${text}`,
      html: `${text}`,
    };
    sgMail.send(msg);
  }

  /**
   *
   * @param {Object} user - user for which verification will be performed
   * @param {Object} res - response object
   * @returns {Object} error responses
   */
  static emailVerificationValidation(user, res) {
    if (!Object.keys(user).length) {
      return ResponseHandler
        .error(404, 'User does not exist', res);
    }
    if (user.isVerified) {
      return ResponseHandler
        .error(400, 'User has already been verified', res);
    }
  }

  /**
   *
   * @param {Object} user - user for which verification will be performed
   * @returns {Object} error responses
   */
  static emailCanBeVerified(user) {
    return Object.keys(user).length && !user.isVerified;
  }
}

export default EmailHelperClass;
