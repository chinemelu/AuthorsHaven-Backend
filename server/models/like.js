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
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  reply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply'
  }
},
{
  timestamps: true
});

const Like = mongoose.model('Like', likeSchema);

export default Like;
