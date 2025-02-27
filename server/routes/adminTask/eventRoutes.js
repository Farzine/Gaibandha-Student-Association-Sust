const express = require("express");
const router = express.Router();
const upload = require("../../config/multer");
const eventController = require("../../controllers/adminTask/eventController");
const authenticateToken = require("../../middlewares/authMiddleware");


router.post("/create", authenticateToken, upload.array("images", 10), eventController.createEvent); // 10 images max

router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);

router.put("/:id", authenticateToken, upload.array("images", 10), eventController.updateEvent);
router.delete("/:id", authenticateToken, eventController.deleteEvent);
router.delete("/:eventId/image/:imageId", authenticateToken, eventController.deleteEventImage);

module.exports = router;
