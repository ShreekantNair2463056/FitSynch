const Class = require('../models/Class');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Create a new class (Trainer/Admin)
const createClass = async (req, res, next) => {
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

    const { trainerId, title, description, schedule, durationMinutes, capacity } = req.body;

    // Verify trainer exists and has Trainer role
    const trainer = await User.findById(trainerId);
    if (!trainer || trainer.role !== 'Trainer') {
      return res.status(400).json({
        success: false,
        message: 'Invalid trainerId: User not found or does not have Trainer role',
        errorCode: '400'
      });
    }

    const scheduleDate = new Date(schedule);

    // Conflict check: Ensure trainer doesn't have another class starting at the exact same time
    const conflictClass = await Class.findOne({ trainerId, schedule: scheduleDate });
    if (conflictClass) {
      return res.status(409).json({
        success: false,
        message: 'Scheduling conflict: Trainer already has a class at this exact time',
        errorCode: '409'
      });
    }

    const newClass = await Class.create({
      trainerId,
      title,
      description,
      schedule,
      durationMinutes,
      capacity,
      bookedCount: 0
    });

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: newClass
    });
  } catch (error) {
    next(error);
  }
};

// Get all classes
const getAllClasses = async (req, res, next) => {
  try {
    const classes = await Class.find().populate('trainerId', 'name email').sort({ schedule: 1 });
    res.status(200).json({
      success: true,
      message: 'Classes retrieved successfully',
      data: classes
    });
  } catch (error) {
    next(error);
  }
};

// Get class by ID
const getClassById = async (req, res, next) => {
  try {
    const classSession = await Class.findById(req.params.id).populate('trainerId', 'name email');
    
    if (!classSession) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
        errorCode: '404'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class retrieved successfully',
      data: classSession
    });
  } catch (error) {
    next(error);
  }
};

// Update a class
const updateClass = async (req, res, next) => {
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

    // Ensure capacity doesn't go below bookedCount
    if (req.body.capacity !== undefined) {
      const existingClass = await Class.findById(req.params.id);
      if (!existingClass) {
        return res.status(404).json({
          success: false,
          message: 'Class not found',
          errorCode: '404'
        });
      }
      if (req.body.capacity < existingClass.bookedCount) {
        return res.status(400).json({
          success: false,
          message: 'Capacity cannot be reduced below the current number of booked members',
          errorCode: '400'
        });
      }
    }

    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('trainerId', 'name email');

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
        errorCode: '404'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class updated successfully',
      data: updatedClass
    });
  } catch (error) {
    next(error);
  }
};

// Delete a class
const deleteClass = async (req, res, next) => {
  try {
    const classSession = await Class.findByIdAndDelete(req.params.id);

    if (!classSession) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
        errorCode: '404'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass
};
