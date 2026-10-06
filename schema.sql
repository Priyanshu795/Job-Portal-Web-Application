-- ===================================================
-- Job Portal Web Application - Database Schema
-- Author: Priyanshu Kumar (github.com/Priyanshu795)
-- Database: MySQL 8.0+
-- ===================================================

CREATE DATABASE IF NOT EXISTS job_portal_db;
USE job_portal_db;

-- Clean existing tables in order
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS users;

-- 1. Users Table (Seekers & Employers)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('seeker', 'employer', 'admin') DEFAULT 'seeker',
    title VARCHAR(100) DEFAULT '',
    company VARCHAR(100) DEFAULT '',
    bio TEXT,
    skills VARCHAR(255) DEFAULT '',
    location VARCHAR(100) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Jobs Table
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employer_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    job_type ENUM('Full-time', 'Part-time', 'Internship', 'Contract') DEFAULT 'Full-time',
    workplace_type ENUM('Remote', 'On-site', 'Hybrid') DEFAULT 'Hybrid',
    salary_range VARCHAR(100) NOT NULL,
    experience_level VARCHAR(50) DEFAULT 'Entry Level',
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    status ENUM('Active', 'Closed') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_jobs_employer FOREIGN KEY (employer_id) 
        REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Applications Table
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    applicant_id INT NOT NULL,
    applicant_name VARCHAR(100) NOT NULL,
    applicant_email VARCHAR(120) NOT NULL,
    phone VARCHAR(20),
    resume_url VARCHAR(255) DEFAULT '',
    cover_letter TEXT,
    experience_years INT DEFAULT 0,
    status ENUM('Pending', 'Reviewed', 'Interviewing', 'Accepted', 'Rejected') DEFAULT 'Pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_application_job FOREIGN KEY (job_id) 
        REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT fk_application_applicant FOREIGN KEY (applicant_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_job_applicant UNIQUE (job_id, applicant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for performance
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_type ON jobs(job_type);
CREATE INDEX idx_applications_status ON applications(status);
