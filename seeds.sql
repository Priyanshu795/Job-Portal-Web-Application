-- ===================================================
-- Job Portal Web Application - Sample Seed Data
-- Author: Priyanshu Kumar (github.com/Priyanshu795)
-- ===================================================

USE job_portal_db;

-- Insert Users (Employers and Job Seekers)
-- Passwords stored (plain demo or hash: 'password123')
INSERT INTO users (id, name, email, password_hash, role, title, company, bio, skills, location) VALUES
(1, 'TechCorp Hiring Team', 'recruiter@techcorp.io', '$2b$10$demoHashRecruiterPassword1234567', 'employer', 'Technical Recruiter', 'TechCorp Solutions', 'Global enterprise cloud software development company.', 'Recruiting, Sourcing, Technical Screening', 'Bengaluru, India'),
(2, 'Nexus Labs HR', 'careers@nexuslabs.co', '$2b$10$demoHashRecruiterPassword1234567', 'employer', 'Head of People', 'Nexus Labs', 'AI-driven analytics and distributed fintech systems.', 'Talent Acquisition, People Operations', 'Hyderabad, India'),
(3, 'Priyanshu Kumar', 'priyanshu@example.com', '$2b$10$demoHashApplicantPassword1234567', 'seeker', 'Full-Stack Developer', '', 'B.Tech CS graduate skilled in React, Node.js, Express, and MySQL.', 'React, JavaScript, Node.js, Express, MySQL, REST APIs', 'Purnea, Bihar'),
(4, 'Aditi Sharma', 'aditi.sharma@example.com', '$2b$10$demoHashApplicantPassword1234567', 'seeker', 'Frontend Engineer', '', 'Passionate about responsive web design, React, and CSS animations.', 'React, Redux, CSS3, Tailwind, JavaScript', 'Delhi, India'),
(5, 'Vikram Malhotra', 'vikram.m@example.com', '$2b$10$demoHashApplicantPassword1234567', 'seeker', 'Backend Engineer', '', 'Specialized in microservices, Node.js, and SQL databases.', 'Node.js, Express, MySQL, Docker, REST APIs', 'Bengaluru, India');

-- Insert Jobs
INSERT INTO jobs (id, employer_id, title, company, location, job_type, workplace_type, salary_range, experience_level, description, requirements, status) VALUES
(1, 1, 'Associate Software Engineer - React / Node.js', 'TechCorp Solutions', 'Bengaluru, India', 'Full-time', 'Hybrid', '₹7,50,000 - ₹11,00,000 / yr', 'Entry Level (0-2 yrs)', 
'We are looking for an energetic Junior Software Engineer to join our core product engineering team. You will build user-facing features in React and scale REST APIs with Node.js & MySQL.', 
'• Strong foundation in JavaScript (ES6+), React.js, and Node.js.\n• Familiarity with MySQL database queries and RESTful architecture.\n• Good problem-solving and collaboration skills.', 'Active'),

(2, 1, 'Frontend Developer (React.js)', 'TechCorp Solutions', 'Remote', 'Full-time', 'Remote', '₹6,00,000 - ₹9,50,000 / yr', '1-3 years', 
'Join our design systems and frontend performance squad. You will turn design mockups into slick, high-performance web components.', 
'• Proficient with React, HTML5, CSS3, and JavaScript.\n• Experience with responsive styling and REST API integration.\n• Strong eye for detail and UI aesthetics.', 'Active'),

(3, 2, 'Backend API Developer (Node.js & MySQL)', 'Nexus Labs', 'Hyderabad, India', 'Full-time', 'On-site', '₹8,00,000 - ₹13,00,000 / yr', 'Entry to Mid Level', 
'Build high-throughput REST APIs and database pipelines handling millions of financial data points daily.', 
'• In-depth understanding of Express.js, Node.js, and relational SQL databases.\n• Experience with indexing, query optimization, and transactions.\n• Familiarity with Git and Postman.', 'Active'),

(4, 2, 'Full-Stack Web Development Intern', 'Nexus Labs', 'Remote', 'Internship', 'Remote', '₹25,000 - ₹35,000 / month', 'College Student / Fresher', 
'Great 6-month internship opportunity for aspiring full-stack engineers to gain real-world enterprise experience.', 
'• Basic proficiency in JavaScript, React, and Node.js.\n• Eager to learn, communicative, and passionate about software craft.', 'Active');

-- Insert Applications
INSERT INTO applications (job_id, applicant_id, applicant_name, applicant_email, phone, resume_url, cover_letter, experience_years, status) VALUES
(1, 3, 'Priyanshu Kumar', 'priyanshu@example.com', '+91 78XXXXXXXX', 'https://github.com/Priyanshu795', 'I have hands-on experience building full-stack web applications with React, Node.js, Express, and MySQL. Excited to contribute to TechCorp!', 1, 'Interviewing'),
(2, 4, 'Aditi Sharma', 'aditi.sharma@example.com', '+91 9876543210', 'https://github.com/aditi-sharma', 'Passionate about frontend development and clean responsive UI design.', 1, 'Reviewed'),
(3, 5, 'Vikram Malhotra', 'vikram.m@example.com', '+91 9812345678', 'https://github.com/vikram-m', 'Extensive experience in relational database design and Node.js REST APIs.', 2, 'Accepted'),
(4, 3, 'Priyanshu Kumar', 'priyanshu@example.com', '+91 78XXXXXXXX', 'https://github.com/Priyanshu795', 'Keen to join as full-stack intern and expand my technical knowledge.', 0, 'Pending');
