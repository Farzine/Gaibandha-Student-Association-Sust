const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/login', userController.loginUser);
router.post('/cancel-registration', userController.cancelRegistration);
router.post('/logout', authenticateToken, userController.logoutUser);
router.post('/register', userController.registerUser);
router.post('/updateUser', authenticateToken, upload.single("profilePic"), userController.updateUserDetails); 
router.post('/verify-email', userController.verifyEmail);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/resend-code', userController.resendCode);
router.post('/resend-code-for-reset-Password', userController.resendCodeForResetPassword);
router.get("/:id", userController.getUserDetails);

module.exports = router;
