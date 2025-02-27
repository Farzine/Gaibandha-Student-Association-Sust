const express = require('express');
const router = express.Router();
const { markNotificationAsRead, getAllNotifications } = require('../../controllers/adminTask/notificationController');
const authenticateToken = require('../../middlewares/authMiddleware');


router.delete('/:id', authenticateToken, markNotificationAsRead);
router.get('/', authenticateToken, getAllNotifications);

module.exports = router;