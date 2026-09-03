const express = require('express');
const { body } = require('express-validator');
const { createPlan, getPlans, updatePlan, deletePlan } = require('../controllers/planController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

const planValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('durationMonths').isInt({ min: 1 }).withMessage('Duration must be at least 1 month'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('features').optional().isArray().withMessage('Features must be an array of strings')
];

// All routes require authentication
router.use(verifyToken);

// Publicly available (to authenticated users)
router.get('/', getPlans);

// Admin only routes
router.use(authorizeRoles('Admin'));

router.post('/', planValidation, createPlan);
router.put('/:id', planValidation, updatePlan);
router.delete('/:id', deletePlan);

module.exports = router;
