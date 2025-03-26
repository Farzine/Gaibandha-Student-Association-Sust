const express = require('express');
const router = express.Router();
const upload = require('../../config/multer');
const youtubeVideoController = require('../../controllers/adminTask/youtubeVideoController');
const authenticateToken = require('../../middlewares/authMiddleware');

router.post('/upload', authenticateToken, upload.single('image'), youtubeVideoController.uploadYoutubeVideo);
router.delete('/:id', authenticateToken, youtubeVideoController.deleteYoutubeVideo);
router.get('/', youtubeVideoController.getAllYoutubeVideo);

module.exports = router;