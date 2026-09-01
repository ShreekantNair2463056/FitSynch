const express = require('express');
const { getMemberDashboard } = require('../controllers/dashboardController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyToken);

// Protected: Member only
router.get('/me', authorizeRoles('Member'), getMemberDashboard);

module.exports = router;
