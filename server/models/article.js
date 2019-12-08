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
  meta: {
    votes: Number,
    timeToRead: Number,
    favs: Number
  }
},
{
  timestamps: true
});

articleSchema.pre('save', function preSave() {
  this.meta.timeToRead = UserHelperClass.timeToReadArticle(this.body);
});

articleSchema.pre('updateOne', async function preUpdate() {
  console.log('update', this._update);
  const updatedTimeToRead = UserHelperClass
    .timeToReadArticle(this._update.body);
  this._update.meta.timeToRead = updatedTimeToRead;
});


const Article = mongoose.model('Article', articleSchema);

export default Article;
