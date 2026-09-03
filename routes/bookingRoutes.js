const express = require('express');
const { param } = require('express-validator');
const { 
  cancelBooking, 
  getMemberBookings 
} = require('../controllers/bookingController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

const cancelValidation = [
  param('id').isMongoId().withMessage('Invalid Booking ID format')
];

// All routes require authentication
router.use(verifyToken);

// Member only routes
router.get('/me', authorizeRoles('Member'), getMemberBookings);

// Member or Admin routes
router.put('/:id/cancel', authorizeRoles('Member', 'Admin'), cancelValidation, cancelBooking);
router.delete('/:id/cancel', authorizeRoles('Member', 'Admin'), cancelValidation, cancelBooking);

module.exports = router;
