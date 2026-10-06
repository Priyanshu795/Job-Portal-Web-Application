const db = require('../config/db');

// @desc    Get all jobs (with query filters)
// @route   GET /api/jobs
exports.getAllJobs = async (req, res, next) => {
  try {
    const { keyword, location, job_type, workplace_type } = req.query;
    let jobs = await db.query('SELECT * FROM jobs ORDER BY id DESC');

    if (keyword) {
      const q = keyword.toLowerCase();
      jobs = jobs.filter(j => 
        j.title.toLowerCase().includes(q) || 
        j.company.toLowerCase().includes(q) || 
        j.description.toLowerCase().includes(q)
      );
    }
    if (location && location !== 'All') {
      jobs = jobs.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (job_type && job_type !== 'All') {
      jobs = jobs.filter(j => j.job_type === job_type);
    }
    if (workplace_type && workplace_type !== 'All') {
      jobs = jobs.filter(j => j.workplace_type === workplace_type);
    }

    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
exports.getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const jobs = await db.query('SELECT * FROM jobs WHERE id = ?', [id]);
    if (jobs.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Get applications count for this job
    const applications = await db.query('SELECT * FROM applications WHERE job_id = ?', [id]);

    res.json({
      success: true,
      data: {
        ...jobs[0],
        applications_count: applications.length
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new job posting (Employer)
// @route   POST /api/jobs
exports.createJob = async (req, res, next) => {
  try {
    const { employer_id, title, company, location, job_type, workplace_type, salary_range, experience_level, description, requirements } = req.body;

    if (!title || !company || !location || !salary_range || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, company, location, salary_range, and description.'
      });
    }

    const empId = employer_id || 1;

    const result = await db.query(
      'INSERT INTO jobs (employer_id, title, company, location, job_type, workplace_type, salary_range, experience_level, description, requirements) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [empId, title, company, location, job_type || 'Full-time', workplace_type || 'Hybrid', salary_range, experience_level || 'Entry Level', description, requirements || '']
    );

    res.status(201).json({
      success: true,
      message: 'Job opening posted successfully!',
      data: {
        id: result.insertId,
        employer_id: empId,
        title,
        company,
        location,
        job_type: job_type || 'Full-time',
        workplace_type: workplace_type || 'Hybrid',
        salary_range,
        experience_level: experience_level || 'Entry Level',
        description,
        requirements
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete job posting
// @route   DELETE /api/jobs/:id
exports.deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM jobs WHERE id = ?', [id]);
    res.json({ success: true, message: 'Job posting deleted successfully' });
  } catch (err) {
    next(err);
  }
};
