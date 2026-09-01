const express = require('express');
const { param, body } = require('express-validator');
const { 
  createOrUpdatePlan, 
  getMemberPlan, 
  getTrainerAssignedPlans 
} = require('../controllers/workoutPlanController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

const planValidation = [
  param('memberId').isMongoId().withMessage('Invalid Member ID format'),
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('workoutNotes').optional().isString().trim(),
  body('dietNotes').optional().isString().trim()
];

// All routes require authentication
router.use(verifyToken);

// Trainer/Admin route to create/update plans for a member
router.post('/members/:memberId/plans', authorizeRoles('Trainer', 'Admin'), planValidation, createOrUpdatePlan);

// Member route to get their own plans
router.get('/plans/me', authorizeRoles('Member'), getMemberPlan);

// Trainer route to get plans they assigned
router.get('/trainers/plans', authorizeRoles('Trainer'), getTrainerAssignedPlans);

module.exports = router;
