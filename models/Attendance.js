const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['GymVisit', 'ClassCheckIn'],
    default: 'GymVisit'
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: function() {
      return this.type === 'ClassCheckIn';
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
