const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middlewares/authMiddleware');
const contactController = require('../../controllers/adminTask/contactController');

// Public route for submitting contact form
router.post('/contact', contactController.submitContact);

// Admin routes (protected)
router.get('/getAll-contacts', authenticateToken, contactController.getAllContacts);
router.get('/get-contact/:id', authenticateToken, contactController.getContactById);
router.put('/contact/:id/status', authenticateToken, contactController.updateContactStatus);
router.delete('/contact/:id',  authenticateToken, contactController.deleteContact);

module.exports = router;