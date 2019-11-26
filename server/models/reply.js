import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  author: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true
  },
  commentId: {
    type: mongoose.ObjectId,
    ref: 'Comment',
    required: true
  },
  body: {
    type: String,
    required: [true, 'Reply is required']
  }
},
{
  timestamps: true
});

const Reply = mongoose.model('Reply', replySchema);

export default Reply;
