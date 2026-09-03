const WorkoutPlan = require('../models/WorkoutPlan');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Create or update plan notes for a specific member (Trainer/Admin)
const createOrUpdatePlan = async (req, res, next) => {
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

    const { memberId } = req.params;
    const { title, workoutNotes, dietNotes } = req.body;
    const trainerId = req.user.id;

    // Check if the member exists
    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
        errorCode: '404'
      });
    }
    
    // Upsert the workout plan for this member
    // Finds a plan for this member. If it exists, updates it. If not, creates it.
    const plan = await WorkoutPlan.findOneAndUpdate(
      { memberId },
      { 
        trainerId, 
        title, 
        workoutNotes, 
        dietNotes 
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Workout and diet plan saved successfully',
      data: plan
    });
  } catch (error) {
    next(error);
  }
};

// Get workout and diet notes assigned to the logged-in member
const getMemberPlan = async (req, res, next) => {
  try {
    const memberId = req.user.id;

    const plans = await WorkoutPlan.find({ memberId })
      .populate('trainerId', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Workout plans retrieved successfully',
      data: plans
    });
  } catch (error) {
    next(error);
  }
};

// Get all plans created by the logged-in trainer
const getTrainerAssignedPlans = async (req, res, next) => {
  try {
    const trainerId = req.user.id;

    const plans = await WorkoutPlan.find({ trainerId })
      .populate('memberId', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Assigned plans retrieved successfully',
      data: plans
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrUpdatePlan,
  getMemberPlan,
  getTrainerAssignedPlans
};
