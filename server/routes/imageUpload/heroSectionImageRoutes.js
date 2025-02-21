const express = require('express');
const router = express.Router();
const upload = require('../../config/multer');
const imageController = require('../../controllers/imageUpload/heroSectionImageController');
const authenticateToken = require('../../middlewares/authMiddleware');

router.post('/upload', authenticateToken, upload.single('image'), imageController.uploadHeroSectionImage);
router.delete('/:id', authenticateToken, imageController.deleteHeroSectionImage);
router.get('/', imageController.getHeroSectionImages);

module.exports = router;
