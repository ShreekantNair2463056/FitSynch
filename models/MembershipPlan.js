const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  durationMonths: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  features: [{
    type: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
