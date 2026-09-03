const Booking = require('../models/Booking');
const Waitlist = require('../models/Waitlist');
const Class = require('../models/Class');
const { validationResult } = require('express-validator');

// Book a class
const bookClass = async (req, res, next) => {
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

    // Check if the member already has a confirmed booking for this class
    const existingBooking = await Booking.findOne({ classId, memberId, status: 'Confirmed' });
    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'You have already booked this class',
        errorCode: '409'
      });
    }

    // Atomic operation: Increment bookedCount ONLY IF bookedCount is less than capacity
    // This safely prevents race conditions where multiple users try to book the last slot simultaneously.
    const updatedClass = await Class.findOneAndUpdate(
      { 
        _id: classId, 
        $expr: { $lt: ["$bookedCount", "$capacity"] } 
      },
      { $inc: { bookedCount: 1 } },
      { new: true }
    );

    if (!updatedClass) {
      // Find out why it failed: class doesn't exist, or capacity is full?
      const classCheck = await Class.findById(classId);
      if (!classCheck) {
        return res.status(404).json({
          success: false,
          message: 'Class not found',
          errorCode: '404'
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Class is already fully booked',
          errorCode: '400'
        });
      }
    }

    // Now safely create the booking record
    const newBooking = await Booking.create({
      classId,
      memberId,
      status: 'Confirmed'
    });

    res.status(201).json({
      success: true,
      message: 'Class booked successfully',
      data: newBooking
    });
  } catch (error) {
    next(error);
  }
};

// Cancel a booking
const cancelBooking = async (req, res, next) => {
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

    const { id: bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
        errorCode: '404'
      });
    }

    // Check Authorization: only the member who made the booking or an Admin can cancel it
    if (booking.memberId.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
        errorCode: '403'
      });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
        errorCode: '400'
      });
    }

    // Update booking status
    booking.status = 'Cancelled';
    await booking.save();

    // -- Waitlist Automatic Promotion Logic --
    const nextInLine = await Waitlist.findOne({ classId: booking.classId, status: 'Waiting' }).sort({ joinedAt: 1 });
    
    if (nextInLine) {
      // Promote the first user on the waitlist
      nextInLine.status = 'Promoted';
      await nextInLine.save();
      
      // Automatically book the class for them
      await Booking.create({
        classId: booking.classId,
        memberId: nextInLine.memberId,
        status: 'Confirmed'
      });
      // Note: Because we promoted someone, the bookedCount stays the same.
    } else {
      // Decrement class bookedCount atomically since no one was waiting
      await Class.findByIdAndUpdate(
        booking.classId,
        { $inc: { bookedCount: -1 } }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// Get current member's bookings
const getMemberBookings = async (req, res, next) => {
  try {
    const memberId = req.user.id;

    const bookings = await Booking.find({ memberId })
      .populate({
        path: 'classId',
        select: 'title schedule durationMinutes trainerId capacity bookedCount',
        populate: {
          path: 'trainerId',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookClass,
  cancelBooking,
  getMemberBookings
};
