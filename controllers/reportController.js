const Attendance = require('../models/Attendance');
const Membership = require('../models/Membership');
const MembershipPlan = require('../models/MembershipPlan');
const { validationResult } = require('express-validator');

// Get attendance trends (grouped by date)
const getAttendanceTrends = async (req, res, next) => {
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

    // Default to last 30 days if no date range is provided in query params
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    const attendanceTrends = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          count: { $sum: 1 },
          gymVisits: {
            $sum: { $cond: [{ $eq: ["$type", "GymVisit"] }, 1, 0] }
          },
          classCheckIns: {
            $sum: { $cond: [{ $eq: ["$type", "ClassCheckIn"] }, 1, 0] }
          }
        }
      },
      {
        $sort: { _id: 1 } // Sort chronologically
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Attendance trends retrieved successfully',
      data: attendanceTrends
    });
  } catch (error) {
    next(error);
  }
};

// Get plan popularity based on total purchases
const getPlanPopularity = async (req, res, next) => {
  try {
    const planPopularity = await Membership.aggregate([
      {
        $group: {
          _id: "$planId",
          totalPurchased: { $sum: 1 },
          activeMembers: {
            $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: "membershipplans", // Mongoose pluralizes model name "MembershipPlan" to "membershipplans"
          localField: "_id",
          foreignField: "_id",
          as: "planDetails"
        }
      },
      {
        $unwind: {
          path: "$planDetails",
          preserveNullAndEmptyArrays: true // Prevents dropping records if plan was deleted
        }
      },
      {
        $project: {
          planName: { $ifNull: ["$planDetails.name", "Unknown/Deleted Plan"] },
          totalPurchased: 1,
          activeMembers: 1,
          durationMonths: "$planDetails.durationMonths",
          price: "$planDetails.price"
        }
      },
      {
        $sort: { totalPurchased: -1 } // Sort by most popular
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Plan popularity retrieved successfully',
      data: planPopularity
    });
  } catch (error) {
    next(error);
  }
};

// Get renewal and expiry rates
const getRenewalRates = async (req, res, next) => {
  try {
    const stats = await Membership.aggregate([
      {
        $group: {
          _id: null,
          totalMemberships: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] }
          },
          expired: {
            $sum: { $cond: [{ $eq: ["$status", "Expired"] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalMemberships: 1,
          active: 1,
          expired: 1,
          pending: 1,
          activeRatio: {
            $cond: [ { $eq: ["$totalMemberships", 0] }, 0, { $divide: ["$active", "$totalMemberships"] } ]
          },
          expiredRatio: {
            $cond: [ { $eq: ["$totalMemberships", 0] }, 0, { $divide: ["$expired", "$totalMemberships"] } ]
          }
        }
      }
    ]);

    // Handle edge case where no memberships exist yet
    const data = stats.length > 0 ? stats[0] : {
      totalMemberships: 0,
      active: 0,
      expired: 0,
      pending: 0,
      activeRatio: 0,
      expiredRatio: 0
    };

    res.status(200).json({
      success: true,
      message: 'Renewal and expiry rates retrieved successfully',
      data: data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAttendanceTrends,
  getPlanPopularity,
  getRenewalRates
};
