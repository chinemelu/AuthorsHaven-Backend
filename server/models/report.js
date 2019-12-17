import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  reportType: {
    type: String,
    enum: ['spam', 'harassment', 'violation'],
  }
},
{
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
