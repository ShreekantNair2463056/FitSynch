const Attendance = require('../models/Attendance');
const Membership = require('../models/Membership');
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

// Record a check-in
const recordCheckIn = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errorCode: '400',
        data: errors.array()
      });
    }

    // A member can check themselves in, or staff can provide a memberId
    const memberId = req.body.memberId || req.user.id;
    const { type, classId } = req.body;

    if (type === 'GymVisit') {
      // 1. Check if the user has an active membership
      const currentDate = new Date();
      const activeMembership = await Membership.findOne({
        memberId,
        status: 'Active',
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate }
      });

      if (!activeMembership) {
        return res.status(403).json({
          success: false,
          message: 'Active membership required for Gym Visit',
          errorCode: '403'
        });
      }

      // 2. Prevent multiple gym check-ins within a short timeframe (e.g., 2 hours)
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const recentCheckIn = await Attendance.findOne({
        memberId,
        type: 'GymVisit',
        date: { $gte: twoHoursAgo }
      });

      if (recentCheckIn) {
        return res.status(409).json({
          success: false,
          message: 'You have already checked in recently',
          errorCode: '409'
        });
      }
    } else if (type === 'ClassCheckIn') {
      if (!classId) {
        return res.status(400).json({
          success: false,
          message: 'classId is required for Class Check-In',
          errorCode: '400'
        });
      }

      // 1. Check if they have a confirmed booking for the class
      const booking = await Booking.findOne({
        memberId,
        classId,
        status: 'Confirmed'
      });

      if (!booking) {
        return res.status(403).json({
          success: false,
          message: 'Confirmed booking required for Class Check-In',
          errorCode: '403'
        });
      }

      // 2. Prevent duplicate class check-ins
      const existingCheckIn = await Attendance.findOne({
        memberId,
        type: 'ClassCheckIn',
        classId
      });

      if (existingCheckIn) {
        return res.status(409).json({
          success: false,
          message: 'Already checked in for this class',
          errorCode: '409'
        });
      }
    }

    // Record the attendance
    const attendance = await Attendance.create({
      memberId,
      type,
      classId: type === 'ClassCheckIn' ? classId : undefined,
      date: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Check-in successful',
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

// Get attendance history for the logged-in member
const getMemberAttendance = async (req, res, next) => {
  try {
    const memberId = req.user.id;

    const attendances = await Attendance.find({ memberId })
      .populate('classId', 'title schedule')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: 'Attendance retrieved successfully',
      data: attendances
    });
  } catch (error) {
    next(error);
  }
};

// Get branch/overall attendance logs (Admin/Trainer)
const getBranchAttendanceLogs = async (req, res, next) => {
  try {
    const attendances = await Attendance.find()
      .populate('memberId', 'name email')
      .populate('classId', 'title schedule')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: 'Overall attendance logs retrieved successfully',
      data: attendances
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordCheckIn,
  getMemberAttendance,
  getBranchAttendanceLogs
};
