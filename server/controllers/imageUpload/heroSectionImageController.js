const cloudinary = require('../../config/cloudinary');
const HeroSectionImage = require('../../models/imageUpload/heroSectionImage');


exports.uploadHeroSectionImage = async (req, res) => {
    try {
        const file = req.file;
        const { title, description } = req.body;
    
        if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
        }
    
        const image = new HeroSectionImage({
            path: file.path,
            public_id: file.filename,
            title,
            description,
        });

        await image.save();
        res.status(200).json({ message: 'Image uploaded successfully', image });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.deleteHeroSectionImage = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await HeroSectionImage.findById(id);
    
        if (!image) {
        return res.status(404).json({ message: 'Image not found' });
        }
    
        await cloudinary.uploader.destroy(image.public_id);
        await HeroSectionImage.findByIdAndDelete(id);
    
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getHeroSectionImages = async (req, res) => {
    try {
        const images = await HeroSectionImage.find();
        res.status(200).json(images, { message: 'Images fetched successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}