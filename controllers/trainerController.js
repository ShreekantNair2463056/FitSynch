const TrainerProfile = require('../models/TrainerProfile');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Create a new trainer profile (Admin only)
const createTrainerProfile = async (req, res, next) => {
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

    const { userId, specializations, bio, experienceYears, branch } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errorCode: '404'
      });
    }

    // Ensure the user actually has the 'Trainer' role
    if (user.role !== 'Trainer') {
      return res.status(400).json({
        success: false,
        message: 'Provided user does not have the Trainer role',
        errorCode: '400'
      });
    }

    // Check if a profile already exists for this user
    const existingProfile = await TrainerProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: 'Trainer profile already exists for this user',
        errorCode: '409'
      });
    }

    const trainerProfile = await TrainerProfile.create({
      userId,
      specializations,
      bio,
      experienceYears,
      branch
    });

    res.status(201).json({
      success: true,
      message: 'Trainer profile created successfully',
      data: trainerProfile
    });
  } catch (error) {
    next(error);
  }
};

// Get all trainer profiles
const getAllTrainers = async (req, res, next) => {
  try {
    const trainers = await TrainerProfile.find().populate('userId', 'name email role');
    res.status(200).json({
      success: true,
      message: 'Trainers retrieved successfully',
      data: trainers
    });
  } catch (error) {
    next(error);
  }
};

// Get a trainer profile by ID
const getTrainerById = async (req, res, next) => {
  try {
    const trainer = await TrainerProfile.findById(req.params.id).populate('userId', 'name email role');
    
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer profile not found',
        errorCode: '404'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trainer retrieved successfully',
      data: trainer
    });
  } catch (error) {
    next(error);
  }
};

// Update trainer profile (Admin only)
const updateTrainerProfile = async (req, res, next) => {
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

    const { specializations, bio, experienceYears, branch } = req.body;
    
    const trainerProfile = await TrainerProfile.findByIdAndUpdate(
      req.params.id, 
      { specializations, bio, experienceYears, branch },
      { new: true, runValidators: true }
    ).populate('userId', 'name email role');

    if (!trainerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Trainer profile not found',
        errorCode: '404'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trainer profile updated successfully',
      data: trainerProfile
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTrainerProfile,
  getAllTrainers,
  getTrainerById,
  updateTrainerProfile
};
