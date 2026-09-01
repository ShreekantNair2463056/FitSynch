const express = require('express');
const { body } = require('express-validator');
const { 
  recordCheckIn, 
  getMemberAttendance, 
  getBranchAttendanceLogs 
} = require('../controllers/attendanceController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

const checkInValidation = [
  body('type').isIn(['GymVisit', 'ClassCheckIn']).withMessage('Invalid check-in type'),
  body('memberId').optional().isMongoId().withMessage('Invalid Member ID format'),
  body('classId').if(body('type').equals('ClassCheckIn')).notEmpty().withMessage('Class ID is required for class check-ins').isMongoId().withMessage('Invalid Class ID format')
];

// All routes require authentication
router.use(verifyToken);

// Protected: Authenticated users/Staff can record check-in
router.post('/checkin', checkInValidation, recordCheckIn);

// Protected: Member can view their own attendance
router.get('/me', authorizeRoles('Member'), getMemberAttendance);

// Protected: Trainer/Admin can view overall attendance logs
router.get('/admin/attendance', authorizeRoles('Trainer', 'Admin'), getBranchAttendanceLogs);

module.exports = router;
