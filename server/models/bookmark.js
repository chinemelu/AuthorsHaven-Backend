import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }
},
{
  timestamps: true
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
