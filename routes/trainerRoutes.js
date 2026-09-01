const express = require('express');
const { body } = require('express-validator');
const { 
  createTrainerProfile, 
  getAllTrainers, 
  getTrainerById, 
  updateTrainerProfile 
} = require('../controllers/trainerController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

const createValidation = [
  body('userId').notEmpty().withMessage('User ID is required').isMongoId().withMessage('Invalid User ID format'),
  body('specializations').optional().isArray().withMessage('Specializations must be an array of strings'),
  body('bio').optional().isString().trim(),
  body('experienceYears').optional().isNumeric().withMessage('Experience years must be a number'),
  body('branch').optional().isString().trim()
];

const updateValidation = [
  body('specializations').optional().isArray().withMessage('Specializations must be an array of strings'),
  body('bio').optional().isString().trim(),
  body('experienceYears').optional().isNumeric().withMessage('Experience years must be a number'),
  body('branch').optional().isString().trim()
];

// All routes require authentication
router.use(verifyToken);

// Publicly available to authenticated users (Members/Trainers/Admin)
router.get('/', getAllTrainers);
router.get('/:id', getTrainerById);

// Admin-only routes
router.use(authorizeRoles('Admin'));

router.post('/', createValidation, createTrainerProfile);
router.put('/:id', updateValidation, updateTrainerProfile);

module.exports = router;
