import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

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
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: new ObjectId(),
      required: true
    },
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
