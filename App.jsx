import React, { useState, useEffect } from 'react';
import { api } from './services/api';

export default function App() {
  // Current user role mode: 'seeker' (Priyanshu Kumar) vs 'employer' (TechCorp Recruiter)
  const [currentUser, setCurrentUser] = useState({
    id: 3,
    name: 'Priyanshu Kumar',
    email: 'priyanshu@example.com',
    role: 'seeker',
    title: 'Full-Stack Developer',
    location: 'Purnea, Bihar'
  });

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my-applications' | 'employer'
  const [stats, setStats] = useState({ totalJobs: 4, totalApplications: 3, totalSeekers: 3, totalEmployers: 2 });
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search & Filter state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterJobType, setFilterJobType] = useState('All');
  const [filterWorkplace, setFilterWorkplace] = useState('All');

  // Modals state
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [detailsModalJob, setDetailsModalJob] = useState(null);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Application Form
  const [applicationForm, setApplicationForm] = useState({
    phone: '+91 78XXXXXXXX',
    resume_url: 'https://github.com/Priyanshu795',
    experience_years: 1,
    cover_letter: 'I have hands-on experience building full-stack web applications with React, Node.js, Express, and MySQL. Excited to contribute!'
  });

  // Post Job Form
  const [jobForm, setJobForm] = useState({
    title: '',
    company: 'TechCorp Solutions',
    location: 'Bengaluru, India',
    job_type: 'Full-time',
    workplace_type: 'Hybrid',
    salary_range: '₹8,00,000 - ₹12,00,000 / yr',
    experience_level: 'Entry Level (0-2 yrs)',
    description: '',
    requirements: ''
  });

  // Switch Role
  const handleToggleRole = () => {
    if (currentUser.role === 'seeker') {
      setCurrentUser({
        id: 1,
        name: 'TechCorp Hiring Team',
        email: 'recruiter@techcorp.io',
        role: 'employer',
        title: 'Technical Recruiter',
        company: 'TechCorp Solutions',
        location: 'Bengaluru, India'
      });
      setActiveTab('employer');
      showToast('Switched to Employer Mode (TechCorp Hiring Team)');
    } else {
      setCurrentUser({
        id: 3,
        name: 'Priyanshu Kumar',
        email: 'priyanshu@example.com',
        role: 'seeker',
        title: 'Full-Stack Developer',
        location: 'Purnea, Bihar'
      });
      setActiveTab('browse');
      showToast('Switched to Candidate Mode (Priyanshu Kumar)');
    }
  };

  // Load Data
  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, jobsRes] = await Promise.all([
        api.getStats().catch(() => ({ data: stats })),
        api.getJobs().catch(() => ({ data: [] }))
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (jobsRes.data) setJobs(jobsRes.data);

      // Load seeker applications
      const appsRes = await api.getUserApplications(3).catch(() => ({ data: [] }));
      if (appsRes.data) setMyApplications(appsRes.data);

      // Load all applications for employer review
      const allAppsRes = await api.getJobApplications(1).catch(() => ({ data: [] }));
      if (allAppsRes.data) setAllApplications(allAppsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Jobs
  const filteredJobs = jobs.filter(j => {
    const q = searchKeyword.toLowerCase();
    const matchSearch = j.title.toLowerCase().includes(q) ||
                        j.company.toLowerCase().includes(q) ||
                        j.description.toLowerCase().includes(q);
    const matchLoc = filterLocation === 'All' || j.location.includes(filterLocation);
    const matchType = filterJobType === 'All' || j.job_type === filterJobType;
    const matchWork = filterWorkplace === 'All' || j.workplace_type === filterWorkplace;
    return matchSearch && matchLoc && matchType && matchWork;
  });

  // Handle Application Submit
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      await api.applyJob({
        job_id: applyModalJob.id,
        applicant_id: currentUser.id,
        applicant_name: currentUser.name,
        applicant_email: currentUser.email,
        phone: applicationForm.phone,
        resume_url: applicationForm.resume_url,
        cover_letter: applicationForm.cover_letter,
        experience_years: applicationForm.experience_years
      });

      showToast(`Successfully applied for "${applyModalJob.title}" at ${applyModalJob.company}!`);
      setApplyModalJob(null);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Handle Job Post Submit
  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await api.createJob({
        ...jobForm,
        employer_id: currentUser.id
      });
      showToast(`Job opening "${jobForm.title}" posted successfully!`);
      setIsPostJobOpen(false);
      setJobForm({
        title: '',
        company: currentUser.company || 'TechCorp Solutions',
        location: 'Bengaluru, India',
        job_type: 'Full-time',
        workplace_type: 'Hybrid',
        salary_range: '₹8,00,000 - ₹12,00,000 / yr',
        experience_level: 'Entry Level (0-2 yrs)',
        description: '',
        requirements: ''
      });
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Handle Application Status Update
  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.updateStatus(appId, newStatus);
      showToast(`Applicant status updated to "${newStatus}"`);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const getStatusBadgeClass = (st) => {
    switch (st) {
      case 'Accepted': return 'tag-emerald';
      case 'Interviewing': return 'tag-purple';
      case 'Reviewed': return 'tag-cyan';
      case 'Rejected': return 'tag';
      default: return 'tag-blue';
    }
  };

  return (
    <div>
      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <span>{toast.type === 'success' ? '✓' : '⚠'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="navbar">
        <div className="container nav-container">
          <a href="#" className="brand" onClick={() => setActiveTab('browse')}>
            <div className="brand-icon">💼</div>
            <span>CareerHub</span>
          </a>

          <nav className="nav-tabs">
            <button
              className={`nav-tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
              onClick={() => setActiveTab('browse')}
            >
              🔍 Browse Jobs
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'my-applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-applications')}
            >
              📑 My Applications ({myApplications.length})
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'employer' ? 'active' : ''}`}
              onClick={() => setActiveTab('employer')}
            >
              🏢 Employer Dashboard
            </button>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="user-pill">
              <div className="user-avatar">{currentUser.name.charAt(0)}</div>
              <div>
                <strong style={{ color: '#fff', display: 'block', lineHeight: 1.1 }}>{currentUser.name}</strong>
                <span style={{ fontSize: '0.7rem' }}>
                  {currentUser.role === 'employer' ? '🏢 Employer' : '👨‍💻 Candidate'}
                </span>
              </div>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={handleToggleRole}
              title="Click to toggle between Candidate and Employer perspective"
            >
              ⇄ Switch to {currentUser.role === 'seeker' ? 'Employer' : 'Candidate'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container" style={{ paddingBottom: '4rem' }}>
        {/* TAB 1: BROWSE JOBS */}
        {activeTab === 'browse' && (
          <div>
            {/* Hero Search Box */}
            <section className="hero-banner">
              <h1 className="hero-title">Discover Your Next Tech Opportunity</h1>
              <p className="hero-sub">
                Explore hand-picked engineering roles at top tech organizations and high-growth startups.
              </p>

              <div className="search-box-bar">
                <input
                  type="text"
                  placeholder="Job title, skills (e.g. React, Node.js), or keywords..."
                  className="search-field"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />

                <select
                  className="search-select"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                >
                  <option value="All">All Locations</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Remote">Remote</option>
                </select>

                <select
                  className="search-select"
                  value={filterWorkplace}
                  onChange={(e) => setFilterWorkplace(e.target.value)}
                >
                  <option value="All">All Workplace</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>

                <select
                  className="search-select"
                  value={filterJobType}
                  onChange={(e) => setFilterJobType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </section>

            {/* Portal Stats Strip */}
            <div className="stats-row">
              <div className="stat-box">
                <div style={{ fontSize: '1.75rem' }}>💼</div>
                <div>
                  <div className="stat-box-val">{stats.totalJobs || jobs.length}</div>
                  <div className="stat-box-lbl">Verified Active Jobs</div>
                </div>
              </div>
              <div className="stat-box">
                <div style={{ fontSize: '1.75rem' }}>📄</div>
                <div>
                  <div className="stat-box-val">{stats.totalApplications || 4}</div>
                  <div className="stat-box-lbl">Applications Processed</div>
                </div>
              </div>
              <div className="stat-box">
                <div style={{ fontSize: '1.75rem' }}>🏢</div>
                <div>
                  <div className="stat-box-val">{stats.totalEmployers || 2}+</div>
                  <div className="stat-box-lbl">Hiring Companies</div>
                </div>
              </div>
              <div className="stat-box">
                <div style={{ fontSize: '1.75rem' }}>🎯</div>
                <div>
                  <div className="stat-box-val">100%</div>
                  <div className="stat-box-lbl">Direct Employer Connect</div>
                </div>
              </div>
            </div>

            {/* Job Listings List */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                Available Job Openings ({filteredJobs.length})
              </h2>
            </div>

            <div className="job-list">
              {filteredJobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="job-main">
                    <div className="job-header-line">
                      <h3 className="job-title">{job.title}</h3>
                      <span className="company-name">• {job.company}</span>
                    </div>

                    <div className="job-tags-row">
                      <span className="tag tag-blue">📍 {job.location}</span>
                      <span className="tag tag-cyan">🌐 {job.workplace_type}</span>
                      <span className="tag tag-purple">⏱️ {job.job_type}</span>
                      <span className="tag tag-emerald">🎓 {job.experience_level}</span>
                    </div>

                    <p className="job-desc">{job.description}</p>

                    <div className="salary-tag">💰 {job.salary_range}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: '140px' }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => setApplyModalJob(job)}
                    >
                      Apply Now 🚀
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setDetailsModalJob(job)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}

              {filteredJobs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '16px' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No jobs found matching your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY APPLICATIONS */}
        {activeTab === 'my-applications' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                📑 My Submitted Applications
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Track interview updates and response statuses for positions you've applied for.
              </p>
            </div>

            <div className="job-list">
              {myApplications.map((app) => (
                <div key={app.id} className="job-card">
                  <div className="job-main">
                    <div className="job-header-line">
                      <h3 className="job-title">{app.job_title}</h3>
                      <span className="company-name">• {app.job_company}</span>
                    </div>

                    <div className="job-tags-row">
                      <span className="tag tag-blue">📍 {app.job_location}</span>
                      <span className={`tag ${getStatusBadgeClass(app.status)}`}>
                        Status: {app.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Applied on: {String(app.applied_at).slice(0, 10)}
                      </span>
                    </div>

                    <div style={{ background: 'rgba(11, 17, 32, 0.5)', padding: '0.875rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <strong>Your Cover Note:</strong> {app.cover_letter}
                    </div>
                  </div>
                </div>
              ))}

              {myApplications.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '16px' }}>
                  <p style={{ color: 'var(--text-muted)' }}>You haven't applied to any jobs yet.</p>
                  <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setActiveTab('browse')}>
                    Explore Job Feed
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: EMPLOYER DASHBOARD */}
        {activeTab === 'employer' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                  🏢 Employer Recruitment Hub
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Post open requisitions, review candidates, and manage the candidate pipeline.
                </p>
              </div>

              <button className="btn btn-primary" onClick={() => setIsPostJobOpen(true)}>
                + Post New Job Opening
              </button>
            </div>

            {/* Applicant Review Table */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
                📥 Received Candidate Applications ({allApplications.length})
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Candidate</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Contact</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Portfolio / GitHub</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Exp</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Pipeline Status</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Update Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allApplications.map((cand) => (
                      <tr key={cand.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem' }}>
                          <strong style={{ color: '#fff' }}>{cand.applicant_name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cand.applied_at}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div>{cand.applicant_email}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cand.phone}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <a href={cand.resume_url} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>
                            {cand.resume_url} ↗
                          </a>
                        </td>
                        <td style={{ padding: '1rem' }}>{cand.experience_years} yr(s)</td>
                        <td style={{ padding: '1rem' }}>
                          <span className={`tag ${getStatusBadgeClass(cand.status)}`}>
                            {cand.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <select
                            className="search-select"
                            value={cand.status}
                            onChange={(e) => handleStatusChange(cand.id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: APPLY FOR JOB */}
      {applyModalJob && (
        <div className="modal-overlay" onClick={() => setApplyModalJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Apply for {applyModalJob.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{applyModalJob.company} • {applyModalJob.location}</p>
              </div>
              <button className="close-btn" onClick={() => setApplyModalJob(null)}>✕</button>
            </div>
            <form onSubmit={handleApplySubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" disabled className="form-control" value={currentUser.name} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" disabled className="form-control" value={currentUser.email} />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={applicationForm.phone}
                      onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Years of Experience</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      className="form-control"
                      value={applicationForm.experience_years}
                      onChange={(e) => setApplicationForm({ ...applicationForm, experience_years: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Portfolio / GitHub Profile URL</label>
                  <input
                    type="url"
                    required
                    className="form-control"
                    value={applicationForm.resume_url}
                    onChange={(e) => setApplicationForm({ ...applicationForm, resume_url: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Note / Why are you a great fit?</label>
                  <textarea
                    rows="4"
                    required
                    className="form-control"
                    value={applicationForm.cover_letter}
                    onChange={(e) => setApplicationForm({ ...applicationForm, cover_letter: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setApplyModalJob(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Application 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: JOB DETAILS */}
      {detailsModalJob && (
        <div className="modal-overlay" onClick={() => setDetailsModalJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">{detailsModalJob.title}</h3>
                <p style={{ color: '#93c5fd', fontSize: '0.85rem' }}>{detailsModalJob.company} • {detailsModalJob.location}</p>
              </div>
              <button className="close-btn" onClick={() => setDetailsModalJob(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="job-tags-row">
                <span className="tag tag-blue">💼 {detailsModalJob.job_type}</span>
                <span className="tag tag-cyan">🌐 {detailsModalJob.workplace_type}</span>
                <span className="tag tag-emerald">💰 {detailsModalJob.salary_range}</span>
              </div>

              <h4 style={{ color: '#fff', fontSize: '0.95rem', marginTop: '1.25rem', marginBottom: '0.4rem' }}>
                Role Description
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                {detailsModalJob.description}
              </p>

              <h4 style={{ color: '#fff', fontSize: '0.95rem', marginTop: '1.25rem', marginBottom: '0.4rem' }}>
                Key Qualifications & Requirements
              </h4>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                {detailsModalJob.requirements}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDetailsModalJob(null)}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const j = detailsModalJob;
                  setDetailsModalJob(null);
                  setApplyModalJob(j);
                }}
              >
                Apply for this Position
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: POST JOB */}
      {isPostJobOpen && (
        <div className="modal-overlay" onClick={() => setIsPostJobOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Post a New Job Opening</h3>
              <button className="close-btn" onClick={() => setIsPostJobOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateJob}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full-Stack Engineer"
                    className="form-control"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={jobForm.company}
                      onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bengaluru, India"
                      className="form-control"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Job Type</label>
                    <select
                      className="form-control"
                      value={jobForm.job_type}
                      onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Workplace Model</label>
                    <select
                      className="form-control"
                      value={jobForm.workplace_type}
                      onChange={(e) => setJobForm({ ...jobForm, workplace_type: e.target.value })}
                    >
                      <option value="Hybrid">Hybrid</option>
                      <option value="Remote">Remote</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Salary Range</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹8,00,000 - ₹12,00,000 / yr"
                      className="form-control"
                      value={jobForm.salary_range}
                      onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience Level</label>
                    <input
                      type="text"
                      placeholder="e.g. 1-3 years"
                      className="form-control"
                      value={jobForm.experience_level}
                      onChange={(e) => setJobForm({ ...jobForm, experience_level: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows="3"
                    required
                    className="form-control"
                    placeholder="Describe role responsibilities and day-to-day impact..."
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Requirements (Skills & qualifications)</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="• Proficient in React & Node.js&#10;• Experience with MySQL..."
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsPostJobOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
