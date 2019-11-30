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
   * creates a new user
    * @param {Object} followerObject - object of follower database parameters
    * @returns {Object} savedUser
    */
  static async create(followerObject) {
    let session = null;
    try {
      await Follower.createCollection();
      const _session = await Follower.startSession();
      session = _session;
      session.startTransaction();

      const createdFollower = await GeneralService
        .create(Follower, followerObject);

      const follower = {
        _id: createdFollower.follower,
      };
      await GeneralService
        .findOneAndUpdate(
          UserProfile, {
            owner:
            followerObject.userBeingFollowed
          },
          { followers: follower }
        );
      await session.commitTransaction();
      session.endSession();
      return createdFollower;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(error.errors.body.message);
    }
  }
}

export default FollowerService;
