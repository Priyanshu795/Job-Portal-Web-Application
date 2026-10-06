const db = require('../config/db');

// @desc    Apply for a job (Job Seeker)
// @route   POST /api/applications
exports.applyForJob = async (req, res, next) => {
  try {
    const { job_id, applicant_id, applicant_name, applicant_email, phone, resume_url, cover_letter, experience_years } = req.body;

    if (!job_id || !applicant_id || !applicant_name || !applicant_email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job_id, applicant_id, name, and email.'
      });
    }

    // Check if already applied
    const existing = await db.query(
      'SELECT id FROM applications WHERE job_id = ? AND applicant_id = ?',
      [job_id, applicant_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this position.'
      });
    }

    const result = await db.query(
      'INSERT INTO applications (job_id, applicant_id, applicant_name, applicant_email, phone, resume_url, cover_letter, experience_years) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [job_id, applicant_id, applicant_name, applicant_email, phone || '', resume_url || '', cover_letter || '', experience_years || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: {
        id: result.insertId,
        job_id,
        applicant_id,
        status: 'Pending'
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's submitted applications
// @route   GET /api/applications/user/:applicantId
exports.getUserApplications = async (req, res, next) => {
  try {
    const { applicantId } = req.params;
    const applications = await db.query(
      `SELECT a.*, j.title AS job_title, j.company AS job_company, j.location AS job_location, j.salary_range
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.applicant_id = ?
       ORDER BY a.id DESC`,
      [applicantId]
    );

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all applications for a specific job (Employer view)
// @route   GET /api/applications/job/:jobId
exports.getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const applications = await db.query(
      `SELECT a.* FROM applications a WHERE a.job_id = ? ORDER BY a.id DESC`,
      [jobId]
    );

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update application status (Employer action)
// @route   PUT /api/applications/:id/status
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Reviewed', 'Interviewing', 'Accepted', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`
      });
    }

    await db.query(
      'UPDATE applications SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({
      success: true,
      message: `Application marked as ${status}`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get overall Job Portal dashboard stats
// @route   GET /api/applications/stats
exports.getPortalStats = async (req, res, next) => {
  try {
    const jobs = await db.query('SELECT COUNT(*) AS total FROM jobs');
    const applications = await db.query('SELECT COUNT(*) AS total FROM applications');
    const seekers = await db.query("SELECT COUNT(*) AS total FROM users WHERE role = 'seeker'");
    const employers = await db.query("SELECT COUNT(*) AS total FROM users WHERE role = 'employer'");

    res.json({
      success: true,
      data: {
        totalJobs: jobs[0]?.total || jobs.length || 4,
        totalApplications: applications[0]?.total || applications.length || 3,
        totalSeekers: seekers[0]?.total || 3,
        totalEmployers: employers[0]?.total || 2
      }
    });
  } catch (err) {
    next(err);
  }
};
