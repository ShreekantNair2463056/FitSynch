const Membership = require('../models/Membership');
const MembershipPlan = require('../models/MembershipPlan');
const { validationResult } = require('express-validator');

// Purchase a new membership
const purchaseMembership = async (req, res, next) => {
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

    const { planId } = req.body;
    const memberId = req.user.id;

    // Check if the plan exists
    const plan = await MembershipPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found',
        errorCode: '404'
      });
    }

    // Check if user already has an active membership
    const existingMembership = await Membership.findOne({ 
      memberId, 
      status: 'Active' 
    });

    if (existingMembership) {
      return res.status(409).json({
        success: false,
        message: 'User already has an active membership',
        errorCode: '409'
      });
    }

    // Calculate start and end dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + plan.durationMonths);

    // Create the membership
    const membership = await Membership.create({
      memberId,
      planId,
      startDate,
      endDate,
      status: 'Active'
    });

    res.status(201).json({
      success: true,
      message: 'Membership purchased successfully',
      data: membership
    });
  } catch (error) {
    next(error);
  }
};

// Get current user's active membership
const getMyMembership = async (req, res, next) => {
  try {
    const memberId = req.user.id;

    // Find the most recent membership
    const membership = await Membership.findOne({ memberId }).sort({ createdAt: -1 }).populate('planId');

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'No membership found for this user',
        errorCode: '404'
      });
    }

    // Check if membership is expired and update status if necessary
    const currentDate = new Date();
    if (membership.status === 'Active' && membership.endDate < currentDate) {
      membership.status = 'Expired';
      await membership.save();
    }

    res.status(200).json({
      success: true,
      message: 'Membership retrieved successfully',
      data: membership
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { purchaseMembership, getMyMembership };
