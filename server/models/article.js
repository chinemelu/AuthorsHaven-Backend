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
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Comment'
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
