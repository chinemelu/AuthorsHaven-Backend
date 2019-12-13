import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
},
{
  timestamps: true
});

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
