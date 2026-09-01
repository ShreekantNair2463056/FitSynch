const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
    index: true
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Waiting', 'Promoted', 'Cancelled'],
    default: 'Waiting'
  }
}, { timestamps: true });

// FIFO indexing for efficient queue retrieval
waitlistSchema.index({ classId: 1, joinedAt: 1 });

// Prevent duplicate active waitlist entries for a member on the same class
waitlistSchema.index({ classId: 1, memberId: 1, status: 1 }, { unique: true });

module.exports = mongoose.model('Waitlist', waitlistSchema);
