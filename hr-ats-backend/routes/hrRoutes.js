const express = require('express');
const { 
  getAllJobs, 
  addKeywordsToJob, 
  getApplicationsForJob, 
  unshortlistCandidate 
} = require('../controllers/hrController');
const { protect, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected and restricted to HR role
router.use(protect);
router.use(checkRole('hr'));

// GET /api/hr/jobs - List all jobs across companies
router.get('/jobs', getAllJobs);

// PUT /api/hr/jobs/:jobId/keywords - Save screening keywords to a job
router.put('/jobs/:jobId/keywords', addKeywordsToJob);

// GET /api/hr/applications/:jobId - Fetch applications for a specific job
router.get('/applications/:jobId', getApplicationsForJob);

// PUT /api/hr/applications/:applicationId/unshortlist - Un-shortlist a candidate
router.put('/applications/:applicationId/unshortlist', unshortlistCandidate);

module.exports = router;
