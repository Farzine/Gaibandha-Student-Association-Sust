const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  tag: {
    type: String,
    enum: ['Newcomer\'s welcome', 'Relief', 'Party', 'Programs','Others'],
    required: true,
  },
  year: {
    type: Number,
    required: true,
  }
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;