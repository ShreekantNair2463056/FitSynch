const express = require('express');
const { getMemberWaitlist } = require('../controllers/waitlistController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyToken);

// Protected: Member only
router.get('/me', authorizeRoles('Member'), getMemberWaitlist);

module.exports = router;
