const Job = require('../models/jobModel');
const User = require('../models/userModel');

// POST /api/company/jobs - Create a new job posting
const createJob = async (req, res) => {
  try {
    const { title, employeesRequired } = req.body;
    const companyId = req.user.id; // From JWT middleware

    // Validate input
    if (!title || !employeesRequired) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both job title and number of employees required'
      });
    }

    if (employeesRequired < 1) {
      return res.status(400).json({
        success: false,
        message: 'Number of employees required must be at least 1'
      });
    }

    // Create new job
    const newJob = new Job({
      title,
      employeesRequired: parseInt(employeesRequired),
      company: companyId,
    });

    await newJob.save();

    // Populate company details for response
    await newJob.populate('company', 'email companyName');

    res.status(201).json({
      success: true,
      message: 'Job posted successfully!',
      job: newJob
    });

  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating job'
    });
  }
};

// GET /api/company/jobs - Get all jobs posted by this company
const getCompanyJobs = async (req, res) => {
  try {
    const companyId = req.user.id;

    const jobs = await Job.find({ company: companyId })
      .populate('company', 'email companyName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs
    });

  } catch (error) {
    console.error('Error fetching company jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs'
    });
  }
};

module.exports = {
  createJob,
  getCompanyJobs
};