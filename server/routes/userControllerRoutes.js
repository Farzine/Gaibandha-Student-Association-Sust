const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.post('/updateUser', authenticateToken, userController.updateUserDetails); 

module.exports = router;
