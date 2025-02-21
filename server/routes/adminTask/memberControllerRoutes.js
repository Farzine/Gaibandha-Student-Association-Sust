const express = require('express');
const router = express.Router();
const memberController = require('../../controllers/adminTask/memberController');
const authenticateToken = require('../../middlewares/authMiddleware');


router.get("/member-requests", memberController.getAllMemberRequests);
router.post("/handle-member-requests", authenticateToken, memberController.handleMemberRequest);

router.get("/categorizeMember", memberController.getCategorizedMembers);
router.post("/update-designation", authenticateToken, memberController.updateMemberDesignation);
router.post("/update-alumniStatus", authenticateToken, memberController.updateAlumniStatus);


module.exports = router;