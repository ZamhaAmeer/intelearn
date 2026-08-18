-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS learning_resources;
DROP TABLE IF EXISTS emotional_reports;
DROP TABLE IF EXISTS lecturers;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS faculties;
DROP TABLE IF EXISTS admin_users;

-- 1. Admin Users Table
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_token_expires TIMESTAMP,
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Faculties Table
CREATE TABLE faculties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    dean VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Students Table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    faculty_id INT REFERENCES faculties(id) ON DELETE SET NULL,
    department VARCHAR(100),
    gpa NUMERIC(3, 2) DEFAULT 0.00,
    current_semester INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'Active', -- 'Active', 'Suspended', 'Graduated'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Lecturers Table
CREATE TABLE lecturers (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    faculty_id INT REFERENCES faculties(id) ON DELETE SET NULL,
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Emotional Reports Table
CREATE TABLE emotional_reports (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    detected_emotion VARCHAR(50) NOT NULL CHECK (detected_emotion IN ('Happy', 'Sad', 'Neutral', 'Frustrated')),
    confidence_score NUMERIC(5, 2) NOT NULL,
    trigger_factors TEXT,
    notes TEXT,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Learning Resources Table
CREATE TABLE learning_resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- 'Lecture Notes', 'Textbooks', 'Video Tutorials', 'Past Papers', 'Other'
    file_url VARCHAR(255),
    faculty_id INT REFERENCES faculties(id) ON DELETE CASCADE,
    uploaded_by_lecturer_id INT REFERENCES lecturers(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Announcements Table
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_audience VARCHAR(50) DEFAULT 'All', -- 'All', 'Students', 'Lecturers', 'Faculty-specific'
    faculty_id INT REFERENCES faculties(id) ON DELETE SET NULL,
    published_by INT REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
