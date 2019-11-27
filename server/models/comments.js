import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  body: {
    type: String,
    required: [true, 'Comment is required']
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply',
    required: true
  }]
},
{
  timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
