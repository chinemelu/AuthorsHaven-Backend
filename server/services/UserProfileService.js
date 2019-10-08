import UserProfile from '../models/userProfile';

/**
 * it handles all database calls with respect to a user
 */
class UserProfileService {
  /**
   * creates a new user
   *  @param {Object} userProfileObject - object containing user profile details
    * @param {Object} userId - the id of the user
    * @returns {Object} savedUser
    */
  static async create(userProfileObject, userId) {
    try {
      const userProfile = new UserProfile({
        bio: userProfileObject.bio || '',
        avatar: userProfileObject.avatar || '',
        owner: userId
      });
      const savedUserProfile = await userProfile.save();
      return savedUserProfile;
    } catch (error) {
      throw error;
    }
  }
}

export default UserProfileService;
