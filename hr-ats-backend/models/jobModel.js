const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This links to the company user who posted it
    required: true,
  },
  employeesRequired: {
    type: Number,
    required: true,
    min: 1,
  },
  description: {
    type: String,
  },
  keywords: {
    type: String, // Comma-separated keywords for HR screening
    default: '',
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links to candidate users who applied
  }],
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;