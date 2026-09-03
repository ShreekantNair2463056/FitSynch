const express = require('express');
const { body, param } = require('express-validator');
const { 
  createClass, 
  getAllClasses, 
  getClassById, 
  updateClass, 
  deleteClass 
} = require('../controllers/classController');
const { bookClass } = require('../controllers/bookingController');
const { joinWaitlist } = require('../controllers/waitlistController');

const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

const createValidation = [
  body('trainerId').notEmpty().withMessage('Trainer ID is required').isMongoId().withMessage('Invalid Trainer ID format'),
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('description').optional().isString().trim(),
  body('schedule').isISO8601().withMessage('Schedule must be a valid ISO8601 date'),
  body('durationMinutes').optional().isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1')
];

const updateValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty').trim(),
  body('description').optional().isString().trim(),
  body('schedule').optional().isISO8601().withMessage('Schedule must be a valid ISO8601 date'),
  body('durationMinutes').optional().isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1')
];

// All routes require authentication
router.use(verifyToken);

// Publicly available to authenticated users
router.get('/', getAllClasses);
router.get('/:id', getClassById);

// Member only route for booking
router.post('/:id/book', authorizeRoles('Member'), [
  param('id').isMongoId().withMessage('Invalid Class ID format')
], bookClass);

// Member only route for waitlist
router.post('/:id/waitlist', authorizeRoles('Member'), [
  param('id').isMongoId().withMessage('Invalid Class ID format')
], joinWaitlist);

// Trainer or Admin only routes
router.use(authorizeRoles('Admin', 'Trainer'));

router.post('/', createValidation, createClass);
router.put('/:id', updateValidation, updateClass);
router.delete('/:id', deleteClass);

module.exports = router;
