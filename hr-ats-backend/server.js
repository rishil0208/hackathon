const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: './.env' });

const app = express();

// --- Middlewares ---
// Enable Cross-Origin Resource Sharing so your React app can talk to this server
app.use(cors()); 
// Allow the server to accept and parse JSON in the body of requests
app.use(express.json()); 

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connection successful!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


// --- Routes ---
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); // All auth routes will start with /api/auth

// Mount domain routes
const companyRoutes = require('./routes/companyRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const hrRoutes = require('./routes/hrRoutes');
app.use('/api/company', companyRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/hr', hrRoutes);

// Simple route to check if the server is running
app.get('/', (req, res) => {
    res.send('<h1>Backend API for Job Portal is running!</h1>');
});

// Serve uploaded resumes statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- Start the Server ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        const FALLBACK_PORT = 5001;
        console.warn(`⚠️  Port ${PORT} in use. Falling back to port ${FALLBACK_PORT}...`);
        app.listen(FALLBACK_PORT, () => {
            console.log(`🚀 Server is running on port ${FALLBACK_PORT}`);
        });
    } else {
        console.error('Server error:', err);
    }
});


// --- ADD THIS NEW ROUTE ---
const subscriberRoutes = require('./routes/subscriberRoutes');
app.use('/api', subscriberRoutes); // All subscriber routes will start with /api