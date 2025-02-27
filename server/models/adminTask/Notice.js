const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notice title is required'],
    trim: true,
    minLength: [5, 'Title must be at least 5 characters long'],
    maxLength: [500, 'Title cannot exceed 500 characters']
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Notice = mongoose.model('Notice', noticeSchema);
module.exports = Notice;