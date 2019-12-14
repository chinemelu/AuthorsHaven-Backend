import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  }
},
{
  timestamps: true
});

const Like = mongoose.model('Like', likeSchema);

export default Like;
