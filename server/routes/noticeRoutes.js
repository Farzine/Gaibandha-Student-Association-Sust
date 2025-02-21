const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const noticeController = require('../controllers/noticeController');

// Public routes
router.get('/', noticeController.getAllNotices);
router.get('/:id', noticeController.getNoticeById);

// Protected routes (admin only)
router.post('/', authenticateToken, noticeController.createNotice);
router.put('/:id', authenticateToken, noticeController.updateNotice);
router.delete('/:id', authenticateToken, noticeController.deleteNotice);

module.exports = router;