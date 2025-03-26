const cloudinary = require('../../config/cloudinary');
const YoutubeVideo = require('../../models/adminTask/youtubeVideo');

exports.uploadYoutubeVideo = async (req, res) => {
  try {
    const file = req.file;
    const { videoSrc } = req.body;

    if (!file) {
      return res.status(400).json({ message: 'No thrumbenail uploaded' });
    }

    const youtubeVideo = new YoutubeVideo({
      path: file.path,
      public_id: file.filename,
      videoSrc: videoSrc,
    });

    await youtubeVideo.save();
    res.status(200).json({ message: 'Youtube video link uploaded successfully', youtubeVideo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteYoutubeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const youtubeVideo = await YoutubeVideo.findById(id);

    if (!youtubeVideo) {
      return res.status(404).json({ message: 'Thumbnail not found' });
    }

    await cloudinary.uploader.destroy(youtubeVideo.public_id);
    await YoutubeVideo.findByIdAndDelete(id);

    res.status(200).json({ message: 'Thumbnail deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllYoutubeVideo = async (req, res) => {
  try {
    const youtubeVideo = await YoutubeVideo.find();

    res.status(200).json({
      success: true,
      data: youtubeVideo,
      message: "Youtube video links fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};