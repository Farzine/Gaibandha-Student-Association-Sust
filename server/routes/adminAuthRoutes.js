const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminAuthController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/login', adminController.login);
router.put('/update-email-password', authenticateToken, adminController.updateEmailAndPassword);
router.post('/logout',authenticateToken, adminController.logout); 

module.exports = router;
