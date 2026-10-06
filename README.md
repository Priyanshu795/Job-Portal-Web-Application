# 💼 CareerHub - Job Portal Web Application

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![REST API](https://img.shields.io/badge/API-REST%20Endpoints-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://www.postman.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> A modern full-stack hiring platform connecting job seekers with hiring managers and tech companies. Built with React, Node.js, Express, and MySQL.

---

## 📌 Project Overview

**CareerHub** is an end-to-end full-stack web application engineered to bridge candidates and recruiting teams. It enables job seekers to discover engineering opportunities, search and filter by skill, workplace model, and salary, and track their interview stages in real time. For employers, it offers a hiring dashboard to post vacancies and manage candidate pipelines through each review milestone.

### ✨ Key Features (Resume Highlights)
- **Role-Based Experience**: Tailored flows for both Candidates (job search & application submission) and Employers (job listing creation & candidate review).
- **Advanced Job Search & Filtering**: Instant search across keywords, locations, employment types (`Full-time`, `Internship`, `Contract`), and workplace styles (`Remote`, `Hybrid`, `On-site`).
- **Streamlined Application Workflow**: One-click application modal with contact details, portfolio links, years of experience, and personalized cover notes.
- **Application Tracking System (ATS)**: Job seekers can track application statuses (`Pending`, `Reviewed`, `Interviewing`, `Accepted`, `Rejected`).
- **Employer Recruitment Pipeline**: Hiring managers can view inbound applicants and update hiring stages dynamically.
- **Resilient MySQL Database Integration**: MySQL pool connection with foreign keys and cascade rules, along with a built-in demo fallback mode for immediate local testing.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **Library**: React 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS Design System with dark mode, glowing accents, and responsive layout
- **State & Data**: Native Fetch API client with REST service architecture

### **Backend**
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database Driver**: `mysql2/promise`
- **Security & Config**: `cors`, `dotenv`, central error handler

### **Database**
- **Engine**: MySQL 8.0+
- **Schema**: Relational model with `users`, `jobs`, and `applications` tables.

---

## 🗄️ Database Schema & ER Design

```text
  +------------------+         +---------------------+         +------------------+
  |      USERS       |         |        JOBS         |         |   APPLICATIONS   |
  +------------------+         +---------------------+         +------------------+
  | id (PK)          |<---+    | id (PK)             |<---+    | id (PK)          |
  | name             |    |    | employer_id (FK)----+    +----| job_id (FK)      |
  | email (UQ)       |    +----| applicant_id (FK)   |         | applicant_id (FK)|
  | password_hash    |         | title               |         | applicant_name   |
  | role             |         | company             |         | applicant_email  |
  | company          |         | location            |         | resume_url       |
  | title            |         | job_type            |         | cover_letter     |
  | bio              |         | workplace_type      |         | experience_years |
  | skills           |         | salary_range        |         | status           |
  | location         |         | description         |         | applied_at       |
  +------------------+         | requirements        |         +------------------+
                               | status              |
                               +---------------------+
```

---

## 🚀 REST API Documentation

### **1. Authentication & Profiles**
| Method | Endpoint | Description | Sample Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user (seeker / employer) | `{"name":"Aarav","email":"aarav@dev.com","password":"pwd","role":"seeker"}` |
| `POST` | `/api/auth/login` | Authenticate user credentials | `{"email":"aarav@dev.com","password":"pwd"}` |
| `GET` | `/api/auth/me?userId=3` | Retrieve current authenticated user profile | None |

### **2. Jobs Endpoints**
| Method | Endpoint | Description | Sample Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Retrieve all jobs (supports `?keyword=&location=&job_type=`) | None |
| `GET` | `/api/jobs/:id` | Get single job details with applicant count | None |
| `POST` | `/api/jobs` | Post new job opening (Employer) | `{"title":"Software Engineer","company":"TechCorp","location":"Bengaluru","salary_range":"10 LPA","description":"..."}` |
| `DELETE` | `/api/jobs/:id` | Delete job opening | None |

### **3. Applications Endpoints**
| Method | Endpoint | Description | Sample Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/applications/stats` | Summary statistics of portal | None |
| `POST` | `/api/applications` | Submit application for a job | `{"job_id":1,"applicant_id":3,"applicant_name":"Priyanshu","applicant_email":"...","phone":"...","resume_url":"..."}` |
| `GET` | `/api/applications/user/:id` | Get all applications submitted by candidate | None |
| `GET` | `/api/applications/job/:id` | Get all candidates who applied for a job | None |
| `PUT` | `/api/applications/:id/status`| Update status (`Interviewing`, `Accepted`, etc.) | `{"status":"Interviewing"}` |

---

## ⚡ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (optional; fallback demo mode works out-of-the-box)
- [Git](https://git-scm.com/)

---

### Step 1: Clone Repository
```bash
git clone https://github.com/Priyanshu795/job-portal-web-application.git
cd job-portal-web-application
```

---

### Step 2: Database Setup (MySQL)
Run the initialization scripts in MySQL:
```sql
SOURCE backend/database/schema.sql;
SOURCE backend/database/seeds.sql;
```

---

### Step 3: Backend Setup
```bash
cd backend
npm install
```
Configure `.env` if desired (defaults work locally):
```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=job_portal_db
DB_PORT=3306
```
Start the API server:
```bash
npm run dev
# Server runs on http://localhost:5001
```

---

### Step 4: Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3001
```
Open **http://localhost:3001** in your browser.

---

## 📁 Repository Structure
```text
job-portal-web-application/
├── backend/
│   ├── database/
│   │   ├── schema.sql           # MySQL table schemas
│   │   └── seeds.sql            # Seed data
│   ├── src/
│   │   ├── config/db.js         # MySQL connection & demo store
│   │   ├── controllers/         # Auth, Jobs, and Application handlers
│   │   ├── routes/              # Express REST routes
│   │   ├── middleware/          # Error handling & authentication
│   │   └── server.js            # Express server
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── services/api.js      # API client
│   │   ├── styles/index.css     # Modern CSS styling
│   │   ├── App.jsx              # Main UI & role switcher
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 👨‍💻 Author

**Priyanshu Kumar**
- **GitHub**: [@Priyanshu795](https://github.com/Priyanshu795)
- **LinkedIn**: [Priyanshu Kumar](https://linkedin.com/in/priyanshu-kumar)
- **Education**: B.Tech in Computer Science & Information Technology (ITER, SOA University)

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
