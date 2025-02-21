const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/adminTask/eventController');
const upload = require('../../config/multer');
const authenticateToken = require('../../middlewares/authMiddleware');

router.post('/events', upload.single('eventPhoto'), authenticateToken, eventController.createEvent);

router.put('/events/:id', upload.single('eventPhoto'), authenticateToken, eventController.updateEvent);

router.delete('/events/:id', authenticateToken, eventController.deleteEvent);

router.get('/events', eventController.getAllEvents);

router.get('/events/upcoming', eventController.getUpcomingEvents);

router.get('/events/past', eventController.getPastEvents);

module.exports = router;