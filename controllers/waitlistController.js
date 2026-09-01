const Waitlist = require('../models/Waitlist');
const Class = require('../models/Class');
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

// Join a waitlist
const joinWaitlist = async (req, res, next) => {
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

    const { id: classId } = req.params;
    const memberId = req.user.id;

    // Check if the class exists
    const classCheck = await Class.findById(classId);
    if (!classCheck) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
        errorCode: '404'
      });
    }

    // Only allow joining waitlist if the class is full
    if (classCheck.bookedCount < classCheck.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Class is not full yet. You can book it directly.',
        errorCode: '400'
      });
    }

    // Check if member already has a confirmed booking
    const existingBooking = await Booking.findOne({ classId, memberId, status: 'Confirmed' });
    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'You already have a confirmed booking for this class',
        errorCode: '409'
      });
    }

    // Check if member is already waiting
    const existingWaitlist = await Waitlist.findOne({ classId, memberId, status: 'Waiting' });
    if (existingWaitlist) {
      return res.status(409).json({
        success: false,
        message: 'You are already on the waitlist for this class',
        errorCode: '409'
      });
    }

    const newWaitlist = await Waitlist.create({
      classId,
      memberId,
      status: 'Waiting'
    });

    res.status(201).json({
      success: true,
      message: 'Successfully joined the waitlist',
      data: newWaitlist
    });
  } catch (error) {
    next(error);
  }
};

// Get current member's active waitlists
const getMemberWaitlist = async (req, res, next) => {
  try {
    const memberId = req.user.id;

    const waitlists = await Waitlist.find({ memberId, status: 'Waiting' })
      .populate({
        path: 'classId',
        select: 'title schedule durationMinutes trainerId capacity bookedCount',
        populate: {
          path: 'trainerId',
          select: 'name email'
        }
      })
      .sort({ joinedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Waitlists retrieved successfully',
      data: waitlists
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  joinWaitlist,
  getMemberWaitlist
};
