const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MembershipPlan',
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Pending'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Membership', membershipSchema);
