const Job = require('../models/jobModel');
const User = require('../models/userModel');
const Application = require('../models/applicationModel');
const path = require('path');

// GET /api/candidate/companies - Get all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await User.find({ role: 'company' })
      .select('email companyName createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      companies
    });

  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching companies'
    });
  }
};

// GET /api/candidate/jobs - Get all available jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('company', 'email companyName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs
    });

  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs'
    });
  }
};

// POST /api/candidate/apply - Apply for a job with resume upload
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const candidateId = req.user.id;

    // Validate input
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required'
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if candidate has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: candidateId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create new application
    const newApplication = new Application({
      job: jobId,
      candidate: candidateId,
      // Normalize to forward slashes so it forms a valid URL
      resumePath: (req.file.path || '').replace(/\\/g, '/'),
      status: 'Applied'
    });

    await newApplication.save();

    // Add candidate to job's applicants array
    await Job.findByIdAndUpdate(jobId, {
      $addToSet: { applicants: candidateId }
    });

    // Populate the application for response
    await newApplication.populate([
      { path: 'job', select: 'title employeesRequired' },
      { path: 'candidate', select: 'email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application: newApplication
    });

  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while applying for job'
    });
  }
};

// GET /api/candidate/applications - Get candidate's applications
const getCandidateApplications = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const applications = await Application.find({ candidate: candidateId })
      .populate('job', 'title employeesRequired')
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          select: 'email companyName'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
};

module.exports = {
  getAllCompanies,
  getAllJobs,
  applyForJob,
  getCandidateApplications
};