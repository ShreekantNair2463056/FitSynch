const express = require('express');
const { body } = require('express-validator');
const { purchaseMembership, getMyMembership } = require('../controllers/membershipController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

const purchaseValidation = [
  body('planId').notEmpty().withMessage('Plan ID is required').isMongoId().withMessage('Invalid Plan ID format')
];

// All routes require authentication
router.use(verifyToken);

router.post('/', purchaseValidation, purchaseMembership);
router.get('/me', getMyMembership);

module.exports = router;
