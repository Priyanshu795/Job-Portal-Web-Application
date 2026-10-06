const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;
let useMock = false;

// In-memory demo store initialized with realistic seeds
let mockData = {
  users: [
    {
      id: 1,
      name: 'TechCorp Hiring Team',
      email: 'recruiter@techcorp.io',
      password_hash: '$2b$10$demoHashRecruiterPassword1234567',
      role: 'employer',
      title: 'Technical Recruiter',
      company: 'TechCorp Solutions',
      bio: 'Global enterprise cloud software development company.',
      skills: 'Recruiting, Sourcing, Technical Screening',
      location: 'Bengaluru, India'
    },
    {
      id: 2,
      name: 'Nexus Labs HR',
      email: 'careers@nexuslabs.co',
      password_hash: '$2b$10$demoHashRecruiterPassword1234567',
      role: 'employer',
      title: 'Head of People',
      company: 'Nexus Labs',
      bio: 'AI-driven analytics and distributed fintech systems.',
      skills: 'Talent Acquisition, People Operations',
      location: 'Hyderabad, India'
    },
    {
      id: 3,
      name: 'Priyanshu Kumar',
      email: 'priyanshu@example.com',
      password_hash: '$2b$10$demoHashApplicantPassword1234567',
      role: 'seeker',
      title: 'Full-Stack Developer',
      company: '',
      bio: 'B.Tech CS graduate skilled in React, Node.js, Express, and MySQL.',
      skills: 'React, JavaScript, Node.js, Express, MySQL, REST APIs',
      location: 'Purnea, Bihar'
    },
    {
      id: 4,
      name: 'Aditi Sharma',
      email: 'aditi.sharma@example.com',
      password_hash: '$2b$10$demoHashApplicantPassword1234567',
      role: 'seeker',
      title: 'Frontend Engineer',
      company: '',
      bio: 'Passionate about responsive web design, React, and CSS animations.',
      skills: 'React, Redux, CSS3, Tailwind, JavaScript',
      location: 'Delhi, India'
    }
  ],
  jobs: [
    {
      id: 1,
      employer_id: 1,
      title: 'Associate Software Engineer - React / Node.js',
      company: 'TechCorp Solutions',
      location: 'Bengaluru, India',
      job_type: 'Full-time',
      workplace_type: 'Hybrid',
      salary_range: '₹7,50,000 - ₹11,00,000 / yr',
      experience_level: 'Entry Level (0-2 yrs)',
      description: 'We are looking for an energetic Junior Software Engineer to join our core product engineering team. You will build user-facing features in React and scale REST APIs with Node.js & MySQL.',
      requirements: '• Strong foundation in JavaScript (ES6+), React.js, and Node.js.\n• Familiarity with MySQL database queries and RESTful architecture.\n• Good problem-solving and collaboration skills.',
      status: 'Active',
      created_at: '2026-09-15'
    },
    {
      id: 2,
      employer_id: 1,
      title: 'Frontend Developer (React.js)',
      company: 'TechCorp Solutions',
      location: 'Remote',
      job_type: 'Full-time',
      workplace_type: 'Remote',
      salary_range: '₹6,00,000 - ₹9,50,000 / yr',
      experience_level: '1-3 years',
      description: 'Join our design systems and frontend performance squad. You will turn design mockups into slick, high-performance web components.',
      requirements: '• Proficient with React, HTML5, CSS3, and JavaScript.\n• Experience with responsive styling and REST API integration.\n• Strong eye for detail and UI aesthetics.',
      status: 'Active',
      created_at: '2026-09-20'
    },
    {
      id: 3,
      employer_id: 2,
      title: 'Backend API Developer (Node.js & MySQL)',
      company: 'Nexus Labs',
      location: 'Hyderabad, India',
      job_type: 'Full-time',
      workplace_type: 'On-site',
      salary_range: '₹8,00,000 - ₹13,00,000 / yr',
      experience_level: 'Entry to Mid Level',
      description: 'Build high-throughput REST APIs and database pipelines handling millions of financial data points daily.',
      requirements: '• In-depth understanding of Express.js, Node.js, and relational SQL databases.\n• Experience with indexing, query optimization, and transactions.\n• Familiarity with Git and Postman.',
      status: 'Active',
      created_at: '2026-09-25'
    },
    {
      id: 4,
      employer_id: 2,
      title: 'Full-Stack Web Development Intern',
      company: 'Nexus Labs',
      location: 'Remote',
      job_type: 'Internship',
      workplace_type: 'Remote',
      salary_range: '₹25,000 - ₹35,000 / month',
      experience_level: 'College Student / Fresher',
      description: 'Great 6-month internship opportunity for aspiring full-stack engineers to gain real-world enterprise experience.',
      requirements: '• Basic proficiency in JavaScript, React, and Node.js.\n• Eager to learn, communicative, and passionate about software craft.',
      status: 'Active',
      created_at: '2026-10-01'
    }
  ],
  applications: [
    {
      id: 1,
      job_id: 1,
      applicant_id: 3,
      applicant_name: 'Priyanshu Kumar',
      applicant_email: 'priyanshu@example.com',
      phone: '+91 78XXXXXXXX',
      resume_url: 'https://github.com/Priyanshu795',
      cover_letter: 'I have hands-on experience building full-stack web applications with React, Node.js, Express, and MySQL. Excited to contribute to TechCorp!',
      experience_years: 1,
      status: 'Interviewing',
      applied_at: '2026-10-02'
    },
    {
      id: 2,
      job_id: 2,
      applicant_id: 4,
      applicant_name: 'Aditi Sharma',
      applicant_email: 'aditi.sharma@example.com',
      phone: '+91 9876543210',
      resume_url: 'https://github.com/aditi-sharma',
      cover_letter: 'Passionate about frontend development and clean responsive UI design.',
      experience_years: 1,
      status: 'Reviewed',
      applied_at: '2026-10-03'
    },
    {
      id: 3,
      job_id: 4,
      applicant_id: 3,
      applicant_name: 'Priyanshu Kumar',
      applicant_email: 'priyanshu@example.com',
      phone: '+91 78XXXXXXXX',
      resume_url: 'https://github.com/Priyanshu795',
      cover_letter: 'Keen to join as full-stack intern and expand my technical knowledge.',
      experience_years: 0,
      status: 'Pending',
      applied_at: '2026-10-04'
    }
  ]
};

async function initDB() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'job_portal_db',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000
    });

    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database (job_portal_db) successfully!');
    connection.release();
    useMock = false;
  } catch (error) {
    console.warn('⚠️  MySQL connection failed or not configured for Job Portal. Running in Resilient In-Memory Demo Mode.');
    console.warn(`    Error detail: ${error.message}`);
    console.log('💡 Note: All Job Portal REST APIs will continue working seamlessly in demo mode.');
    useMock = true;
  }
}

async function query(sql, params = []) {
  if (!useMock && pool) {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (err) {
      console.error('MySQL query error, fallback to mock:', err.message);
      return executeMockQuery(sql, params);
    }
  } else {
    return executeMockQuery(sql, params);
  }
}

function executeMockQuery(sql, params = []) {
  const clean = sql.trim().toLowerCase();

  // USERS QUERIES
  if (clean.startsWith('select') && clean.includes('from users')) {
    if (clean.includes('where email =')) {
      const email = params[0];
      return mockData.users.filter(u => u.email.toLowerCase() === email.toLowerCase());
    }
    if (clean.includes('where id =')) {
      const id = Number(params[0]);
      return mockData.users.filter(u => u.id === id);
    }
    return [...mockData.users];
  }

  // INSERT USER
  if (clean.startsWith('insert into users')) {
    const newUser = {
      id: mockData.users.length + 1,
      name: params[0],
      email: params[1],
      password_hash: params[2],
      role: params[3] || 'seeker',
      company: params[4] || '',
      title: params[5] || '',
      location: params[6] || '',
      created_at: new Date()
    };
    mockData.users.push(newUser);
    return { insertId: newUser.id, affectedRows: 1 };
  }

  // JOBS QUERIES
  if (clean.startsWith('select') && clean.includes('from jobs')) {
    if (clean.includes('where j.id =') || clean.includes('where id =')) {
      const id = Number(params[0]);
      return mockData.jobs.filter(j => j.id === id);
    }
    if (clean.includes('where employer_id =')) {
      const empId = Number(params[0]);
      return mockData.jobs.filter(j => j.employer_id === empId);
    }
    return mockData.jobs.map(job => {
      const appCount = mockData.applications.filter(a => a.job_id === job.id).length;
      return { ...job, application_count: appCount };
    });
  }

  // INSERT JOB
  if (clean.startsWith('insert into jobs')) {
    const newJob = {
      id: mockData.jobs.length + 1,
      employer_id: Number(params[0]),
      title: params[1],
      company: params[2],
      location: params[3],
      job_type: params[4] || 'Full-time',
      workplace_type: params[5] || 'Hybrid',
      salary_range: params[6],
      experience_level: params[7],
      description: params[8],
      requirements: params[9],
      status: 'Active',
      created_at: new Date().toISOString().slice(0, 10)
    };
    mockData.jobs.push(newJob);
    return { insertId: newJob.id, affectedRows: 1 };
  }

  // APPLICATIONS QUERIES
  if (clean.startsWith('select') && clean.includes('from applications')) {
    let list = mockData.applications.map(app => {
      const job = mockData.jobs.find(j => j.id === app.job_id) || {};
      return {
        ...app,
        job_title: job.title,
        job_company: job.company,
        job_location: job.location,
        salary_range: job.salary_range
      };
    });

    if (clean.includes('where a.applicant_id =') || clean.includes('where applicant_id =')) {
      return list.filter(a => a.applicant_id === Number(params[0]));
    }
    if (clean.includes('where a.job_id =') || clean.includes('where job_id =')) {
      return list.filter(a => a.job_id === Number(params[0]));
    }
    return list;
  }

  // INSERT APPLICATION
  if (clean.startsWith('insert into applications')) {
    const newApp = {
      id: mockData.applications.length + 1,
      job_id: Number(params[0]),
      applicant_id: Number(params[1]),
      applicant_name: params[2],
      applicant_email: params[3],
      phone: params[4],
      resume_url: params[5],
      cover_letter: params[6],
      experience_years: Number(params[7] || 0),
      status: 'Pending',
      applied_at: new Date().toISOString().slice(0, 10)
    };
    mockData.applications.push(newApp);
    return { insertId: newApp.id, affectedRows: 1 };
  }

  // UPDATE APPLICATION STATUS
  if (clean.startsWith('update applications')) {
    const status = params[0];
    const id = Number(params[1]);
    const app = mockData.applications.find(a => a.id === id);
    if (app) app.status = status;
    return { affectedRows: 1 };
  }

  // DELETE
  if (clean.startsWith('delete from jobs')) {
    const id = Number(params[0]);
    mockData.jobs = mockData.jobs.filter(j => j.id !== id);
    mockData.applications = mockData.applications.filter(a => a.job_id !== id);
    return { affectedRows: 1 };
  }

  return [];
}

module.exports = {
  initDB,
  query,
  get isMock() {
    return useMock;
  }
};
