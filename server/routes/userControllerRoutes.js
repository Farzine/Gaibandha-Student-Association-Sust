const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.post('/updateUser', authenticateToken, userController.updateUserDetails); 
router.post('/verify-email', userController.verifyEmail);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/resend-code', userController.resendCode);

module.exports = router;
