const mongoose = require('mongoose');

const heroSectionImageSchema = new mongoose.Schema({
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
    title: {
        type: String,
        required: true,
    }
});

const HeroSectionImage = mongoose.model('HeroSectionImage', heroSectionImageSchema);

module.exports = HeroSectionImage;