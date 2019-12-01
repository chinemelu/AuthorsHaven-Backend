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
    let session = null;
    try {
      await Follower.createCollection();
      const _session = await Follower.startSession();
      session = _session;
      session.startTransaction();

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
      await session.commitTransaction();
      session.endSession();
      return createdFollower;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(error.errors.body.message);
    }
  }

  /**
   * deletes a new follower
    * @param {Object} followerObject - object of follower database parameters
    * @returns {Object} savedUser
    */
  static async delete(followerObject) {
    let session = null;
    try {
      await Follower.createCollection();
      const _session = await Follower.startSession();
      session = _session;
      session.startTransaction();

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
      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(error.errors.body.message);
    }
  }
}

export default FollowerService;
