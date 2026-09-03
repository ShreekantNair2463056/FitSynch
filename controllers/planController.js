const MembershipPlan = require('../models/MembershipPlan');
const { validationResult } = require('express-validator');

// Create a new membership plan
const createPlan = async (req, res, next) => {
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

    const { name, durationMonths, price, features } = req.body;

    const plan = await MembershipPlan.create({ name, durationMonths, price, features });

    res.status(201).json({
      success: true,
      message: 'Membership plan created successfully',
      data: plan
    });
  } catch (error) {
    next(error);
  }
};

// Get all membership plans
const getPlans = async (req, res, next) => {
  try {
    const plans = await MembershipPlan.find();
    res.status(200).json({
      success: true,
      message: 'Membership plans retrieved successfully',
      data: plans
    });
  } catch (error) {
    next(error);
  }
};

// Update a membership plan
const updatePlan = async (req, res, next) => {
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

    const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found',
        errorCode: '404'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Membership plan updated successfully',
      data: plan
    });
  } catch (error) {
    next(error);
  }
};

// Delete a membership plan
const deletePlan = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found',
        errorCode: '404'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Membership plan deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPlan, getPlans, updatePlan, deletePlan };
