import Follower from '../models/follower';
import UserProfile from '../models/userProfile';
import GeneralService from './GeneralService';

/* eslint no-underscore-dangle:
 ["error", { "allow": ["_id", "_doc", "_session"] }] */
/**
 * it handles all general database calls
 */
class FollowerService {
  /**
   * creates a new follower
    * @param {Object} followerObject - object of follower database parameters
    * @returns {Object} savedUser
    */
  static async create(followerObject) {
    const session = await GeneralService.startTransaction(Follower);
    try {
      const createdFollower = await GeneralService
        .create(Follower, followerObject);

      await GeneralService
        .findOneAndUpdate(
          UserProfile, {
            owner:
            followerObject.userBeingFollowed
          },
          { followers: createdFollower.follower }
        );
      await GeneralService.commitTransaction(session);
      return createdFollower;
    } catch (error) {
      await GeneralService.abortTransaction(session);
      throw new Error(error.errors.body.message);
    }
  }

  /**
   * deletes a new follower
    * @param {Object} followerObject - object of follower database parameters
    * @returns {Object} savedUser
    */
  static async delete(followerObject) {
    const session = await GeneralService.startTransaction(Follower);
    try {
      await GeneralService
        .delete(Follower, ({
          $and: [{ follower: followerObject.follower },
            { userBeingFollowed: followerObject.userBeingFollowed }]
        }));

      await GeneralService
        .findOneAndUpdate(
          UserProfile, {
            owner:
            followerObject.userBeingFollowed
          },
          {
            followers: followerObject.follower
          },
          'pull'
        );
      await GeneralService.commitTransaction(session);
    } catch (error) {
      await GeneralService.abortTransaction(session);
      throw new Error(error.errors.body.message);
    }
  }
}

export default FollowerService;
