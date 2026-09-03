const express = require('express');
const { body } = require('express-validator');
const { register, login, getMembers } = require('../controllers/authController');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['Member', 'Trainer', 'Admin']).withMessage('Invalid role specified')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
  body('password').exists().withMessage('Password is required')
];

const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/members', verifyToken, authorizeRoles('Trainer', 'Admin'), getMembers);

module.exports = router;
