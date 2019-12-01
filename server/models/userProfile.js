import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  avatar: {
    type: String
  },
  bio: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
},
{
  timestamps: true
});


const UserProfile = mongoose.model('Profile', userProfileSchema);

export default UserProfile;
