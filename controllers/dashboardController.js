const Membership = require('../models/Membership');
const Booking = require('../models/Booking');
const Attendance = require('../models/Attendance');
const WorkoutPlan = require('../models/WorkoutPlan');
const Notification = require('../models/Notification');

// Get comprehensive dashboard data for the logged-in member
const getMemberDashboard = async (req, res, next) => {
  try {
    const memberId = req.user.id;
    const currentDate = new Date();

    // Run independent database queries concurrently for maximum efficiency
    const [
      activeMembership,
      upcomingBookings,
      recentAttendance,
      workoutPlan,
      unreadNotifications
    ] = await Promise.all([
      // 1. Current membership status
      Membership.findOne({ memberId, status: 'Active' })
        .populate('planId', 'name durationMonths price')
        .sort({ createdAt: -1 }),

      // 2. Upcoming booked classes
      Booking.find({ memberId, status: 'Confirmed' })
        .populate({
          path: 'classId',
          match: { schedule: { $gte: currentDate } }, // Filter out past classes
          select: 'title schedule durationMinutes trainerId',
          populate: { path: 'trainerId', select: 'name' }
        })
        .sort({ createdAt: -1 }),

      // 3. Recent attendance history (last 5 visits)
      Attendance.find({ memberId })
        .populate('classId', 'title')
        .sort({ date: -1 })
        .limit(5),

      // 4. Assigned workout/diet plan
      WorkoutPlan.findOne({ memberId })
        .populate('trainerId', 'name')
        .sort({ updatedAt: -1 }),

      // 5. Unread notifications
      Notification.find({ memberId, status: 'Unread' })
        .sort({ createdAt: -1 })
    ]);

    // Since mongoose populate with `match` returns `null` for documents that don't match,
    // we need to filter out the null populated classIds to only get truly upcoming classes
    const validUpcomingBookings = upcomingBookings
      .filter(booking => booking.classId !== null)
      .map(booking => ({
        bookingId: booking._id,
        status: booking.status,
        classDetails: booking.classId,
        bookedAt: booking.createdAt
      }))
      // Sort in JS by schedule since we couldn't easily sort by populated field in DB
      .sort((a, b) => new Date(a.classDetails.schedule) - new Date(b.classDetails.schedule))
      .slice(0, 5); // Take the next 5 upcoming classes

    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        membership: activeMembership || null,
        upcomingClasses: validUpcomingBookings,
        recentAttendance: recentAttendance || [],
        workoutPlan: workoutPlan || null,
        unreadNotifications: unreadNotifications || []
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMemberDashboard
};
