const Job = require('../models/jobModel');
const Application = require('../models/applicationModel');

// GET /api/hr/jobs - Get all jobs from all companies
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

// PUT /api/hr/jobs/:jobId/keywords - Add keywords to a job
const addKeywordsToJob = async (req, res) => {
    try {
        const { keywords } = req.body;
        const { jobId } = req.params;

        if (!keywords) {
            return res.status(400).json({
                success: false,
                message: 'Keywords are required'
            });
        }

        const job = await Job.findByIdAndUpdate(
            jobId, 
            { keywords }, 
            { new: true }
        ).populate('company', 'email companyName');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // NOTE: In a real app, this is where you would TRIGGER the resume screening for this job
        res.status(200).json({
            success: true,
            message: 'Keywords added successfully',
            job
        });
    } catch (error) {
        console.error('Error adding keywords:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding keywords'
        });
    }
};

// GET /api/hr/applications/:jobId - Get applications for a specific job
const getApplicationsForJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        // For now, we'll get all 'Applied' and 'Shortlisted' candidates
        // In a real app, the AI screener would update status to 'Shortlisted'
        const applications = await Application.find({ 
            job: jobId,
            status: { $in: ['Applied', 'Shortlisted'] }
        })
            .populate('candidate', 'email')
            .populate('job', 'title employeesRequired keywords')
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

// PUT /api/hr/applications/:applicationId/unshortlist - Remove candidate from shortlist
const unshortlistCandidate = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const application = await Application.findByIdAndUpdate(
            applicationId, 
            { status: 'Rejected' },
            { new: true }
        ).populate('candidate', 'email')
         .populate('job', 'title');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Candidate un-shortlisted successfully',
            application
        });
    } catch (error) {
        console.error('Error un-shortlisting candidate:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while un-shortlisting candidate'
        });
    }
};

module.exports = {
    getAllJobs,
    addKeywordsToJob,
    getApplicationsForJob,
    unshortlistCandidate
};
