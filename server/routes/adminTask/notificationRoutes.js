const express = require('express');
const router = express.Router();
const { markNotificationAsRead, getAllNotifications } = require('../../controllers/adminTask/notificationController');
const authenticateToken = require('../../middlewares/authMiddleware');


router.patch('/mark-as-read/:notificationId', authenticateToken, markNotificationAsRead);
router.get('/:id', authenticateToken, getAllNotifications);


module.exports = router;