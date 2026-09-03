const express = require('express');
const { query } = require('express-validator');
const { 
  getAttendanceTrends, 
  getPlanPopularity, 
  getRenewalRates 
} = require('../controllers/reportController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

const dateValidation = [
  query('startDate').optional().isISO8601().withMessage('startDate must be a valid ISO8601 date'),
  query('endDate').optional().isISO8601().withMessage('endDate must be a valid ISO8601 date')
];

// All routes require authentication
router.use(verifyToken);

// Restrict to Admin or Branch Admin
router.use(authorizeRoles('Admin', 'Branch Admin'));

// Report routes
router.get('/attendance', dateValidation, getAttendanceTrends);
router.get('/plans', getPlanPopularity);
router.get('/renewals', getRenewalRates);

module.exports = router;
