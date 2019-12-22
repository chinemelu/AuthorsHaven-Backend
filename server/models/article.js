import mongoose from 'mongoose';
import UserHelperClass from '../helper/UserHelperClass';


/* eslint no-underscore-dangle:
 ["error", { "allow": ["_update"] }] */

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
  ratings: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Rating'
  }],
  reports: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Report'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Like'
  }],
  meta: {
    likes: {
      type: Number,
      default: 0
    },
    timeToRead: Number,
  }
},
{
  timestamps: true
});

articleSchema.pre('save', function preSave() {
  this.meta.timeToRead = UserHelperClass.timeToReadArticle(this.body);
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
