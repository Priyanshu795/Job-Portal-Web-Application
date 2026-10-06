const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Job Portal Web Application REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`💼 Job Portal API server active on http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  });
});
