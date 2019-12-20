import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: [true, 'ArticleId is required']
  },
  body: {
    type: String,
    required: [true, 'Comment body is required']
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply',
    required: true
  }],
  meta: {
    likes: {
      type: Number,
      default: 0
    },
  }
},
{
  timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
