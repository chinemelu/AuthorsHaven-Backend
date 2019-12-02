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
  }]
},
{
  timestamps: true
});

// commentSchema.pre('save', (next) => {
//   if (!this.body) {
//     next(new Error('something went wrong'));
//   }
//   // If you call `next()` with an argument, that argument is assumed to be
//   // an error.

//   // You can also throw an error in an `async` function
// });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
