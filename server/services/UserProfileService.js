import UserProfile from '../models/userProfile';

/* eslint no-underscore-dangle:
 ["error", { "allow": ["_id", "_doc", "_session"] }] */
/**
/**
 * it handles all database calls with respect to a user
 */
class UserProfileService {
  /**
   * creates a new user
   *  @param {Object} userProfileObject - object containing user profile details
    * @param {Object} userObject - the saved user
    * @returns {Object} savedUser
    */
  static async create(userProfileObject, userObject) {
    try {
      const userProfile = new UserProfile({
        _id: userObject.profile,
        bio: userProfileObject.bio || '',
        avatar: userProfileObject.avatar || '',
        owner: userObject._id
      });
      const savedUserProfile = await userProfile.save();
      return savedUserProfile;
    } catch (error) {
      throw error;
    }
  }
}

export default UserProfileService;
