const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled'],
    default: 'Confirmed'
  }
}, { timestamps: true });

// Compound index to ensure a member can only have one active/confirmed booking per class
bookingSchema.index({ classId: 1, memberId: 1, status: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
