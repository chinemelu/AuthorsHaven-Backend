import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Article title is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    type: String
  }],
  body: {
    type: String,
    required: [true, 'Article body is required']
  },
  comments: [{
    body: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    },
    replies: [{
      type: String,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      date: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  meta: {
    votes: Number,
    favs: Number
  }
},
{
  timestamps: true
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
