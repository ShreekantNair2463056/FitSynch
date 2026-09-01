const mongoose = require('mongoose');

const trainerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // A user can only have one trainer profile
    index: true
  },
  specializations: [{
    type: String,
    trim: true
  }],
  bio: {
    type: String,
    trim: true
  },
  experienceYears: {
    type: Number,
    min: 0,
    default: 0
  },
  branch: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('TrainerProfile', trainerProfileSchema);
