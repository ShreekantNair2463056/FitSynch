const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['ExpiryReminder', 'General'],
    default: 'ExpiryReminder'
  },
  status: {
    type: String,
    enum: ['Unread', 'Read'],
    default: 'Unread'
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
