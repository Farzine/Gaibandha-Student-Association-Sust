const mongoose = require('mongoose');

const youtubeVideoSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  videoSrc: {
    type: String,
    required: false,
  }
});

const YoutubeVideo = mongoose.model('Youtube', youtubeVideoSchema);

module.exports = YoutubeVideo;