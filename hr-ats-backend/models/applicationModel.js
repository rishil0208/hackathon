const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Confirmed', 'Rejected'],
    default: 'Applied',
  },
  resumePath: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;