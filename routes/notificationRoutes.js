const express = require('express');
const { param } = require('express-validator');
const { 
  generateExpiryReminders, 
  getMemberNotifications, 
  markAsRead 
} = require('../controllers/notificationController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

const idValidation = [
  param('id').isMongoId().withMessage('Invalid Notification ID format')
];

// All routes require authentication
router.use(verifyToken);

// Admin route to trigger reminder generation
router.post('/admin/notifications/generate', authorizeRoles('Admin'), generateExpiryReminders);

// Member route to view notifications
router.get('/notifications/me', authorizeRoles('Member'), getMemberNotifications);

// Member route to mark notification as read
router.patch('/notifications/:id/read', authorizeRoles('Member'), idValidation, markAsRead);

module.exports = router;
