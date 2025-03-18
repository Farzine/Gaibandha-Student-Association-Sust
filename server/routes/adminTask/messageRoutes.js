const express = require('express');
const router = express.Router();
const upload = require('../../config/multer');
const authenticateToken = require('../../middlewares/authMiddleware');
const messageController = require('../../controllers/adminTask/messageController');


router.post('/create', authenticateToken, upload.single('image'), messageController.createMessage);
router.put('/update/:id', authenticateToken, upload.single('image'), messageController.updateMessage);
router.delete('/delete/:id', authenticateToken, messageController.deleteMessage);
router.get('/', messageController.getMessages);
router.get('/:id', messageController.getMessageById);

module.exports = router;
