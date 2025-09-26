const express = require('express');
const multer = require('multer');
const path = require('path');
const { 
    getAllCompanies, 
    getAllJobs, 
    applyForJob, 
    getCandidateApplications 
} = require('../controllers/candidateController');
const { protect, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for resume uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resumes/');
    },
    filename: function (req, file, cb) {
        // Create unique filename: candidateId_timestamp_originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, req.user.id + '_' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Only allow PDF files
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// All routes are protected and restricted to candidate role
router.use(protect);
router.use(checkRole('candidate'));

// GET /api/candidate/companies - Get all companies
router.get('/companies', getAllCompanies);

// GET /api/candidate/jobs - Get all available jobs
router.get('/jobs', getAllJobs);

// POST /api/candidate/apply - Apply for a job with resume upload
router.post('/apply', upload.single('resume'), applyForJob);

// GET /api/candidate/applications - Get candidate's applications
router.get('/applications', getCandidateApplications);

module.exports = router;