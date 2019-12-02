import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
  },
  body: {
    type: String,
    required: [true, 'Article body is required']
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


const Reply = mongoose.model('Reply', replySchema);

export default Reply;
