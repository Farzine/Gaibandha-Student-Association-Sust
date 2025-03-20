const cloudinary = require('../../config/cloudinary');
const Image = require('../../models/imageUpload/gallery');

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const { description, tag, year } = req.body;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const image = new Image({
      path: file.path,
      public_id: file.filename,
      description,
      tag,
      year,
    });

    await image.save();
    res.status(200).json({ message: 'Image uploaded successfully', image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    await cloudinary.uploader.destroy(image.public_id);
    await Image.findByIdAndDelete(id);

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getImages = async (req, res) => {
  try {
    const images = await Image.find();

    // Return a JSON object with success, data, and a message
    res.status(200).json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find();

    // Return a JSON object with success, data, and a message
    res.status(200).json({
      success: true,
      data: images,
      message: "Images fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};