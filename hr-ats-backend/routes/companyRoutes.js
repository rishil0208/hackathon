const express = require('express');
const { createJob, getCompanyJobs } = require('../controllers/companyController');
const { protect, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected and restricted to company role
router.use(protect);
router.use(checkRole('company'));

// POST /api/company/jobs - Create a new job posting
router.post('/jobs', createJob);

// GET /api/company/jobs - Get all jobs posted by this company
router.get('/jobs', getCompanyJobs);

module.exports = router;