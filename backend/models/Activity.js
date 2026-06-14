import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['classes', 'assignments', 'events', 'attendance', 'notices'],
    required: true,
  },
  task: {
    type: String,
    required: true,
    trim: true,
  },
  room: {
    type: String,
    default: '',
  },
  deadline: {
    type: Date,
    required: true,
  },
  timeReq: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'done'],
    default: 'pending',
  },
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;