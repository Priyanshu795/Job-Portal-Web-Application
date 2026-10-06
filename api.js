const BASE_URL = '/api';

async function fetchJSON(url, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `HTTP error! status: ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${url}:`, err);
    throw err;
  }
}

export const api = {
  // Stats
  getStats: () => fetchJSON('/applications/stats'),

  // Auth / Profile
  getMe: (userId = 3) => fetchJSON(`/auth/me?userId=${userId}`),
  login: (credentials) => fetchJSON('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => fetchJSON('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // Jobs
  getJobs: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.location) params.append('location', filters.location);
    if (filters.job_type) params.append('job_type', filters.job_type);
    if (filters.workplace_type) params.append('workplace_type', filters.workplace_type);
    return fetchJSON(`/jobs?${params.toString()}`);
  },
  getJobById: (id) => fetchJSON(`/jobs/${id}`),
  createJob: (jobData) => fetchJSON('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData),
  }),
  deleteJob: (id) => fetchJSON(`/jobs/${id}`, {
    method: 'DELETE',
  }),

  // Applications
  applyJob: (applicationData) => fetchJSON('/applications', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  }),
  getUserApplications: (applicantId) => fetchJSON(`/applications/user/${applicantId}`),
  getJobApplications: (jobId) => fetchJSON(`/applications/job/${jobId}`),
  updateStatus: (applicationId, status) => fetchJSON(`/applications/${applicationId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
};
