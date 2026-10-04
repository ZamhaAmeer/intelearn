# Inteleaarn

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)

### An AI-Driven Interactive Learning Management System

Inteleaarn (Interactive Learning Intelligent System) is a centralized, web-based Learning Management System (LMS) designed to optimize institutional academic operations, streamline administrative workflows, and deliver role-specific learning experiences.

The system uses a modular architecture with Role-Based Access Control (RBAC) to manage institutional departments, user permissions, bulk data processing, subject hierarchies, and real-time operational analytics for administrators, lecturers, and students.

---

## 📌 Project Overview

Higher education institutions often face challenges managing fragmented academic records, manual user onboarding, and disconnected course delivery platforms.

Existing academic management tools can be rigid or lack tailored workflows for specific departmental structures. Institutions require a unified hub that separates administrative governance from everyday teaching and learning activities.

Inteleaarn provides a streamlined workflow where administrators can onboard users and manage subjects in bulk, lecturers can curate interactive learning content, and students can access structured academic resources through dedicated dashboards.

### Main Workflow

```text
User Authentication (JWT)
      ↓
Role Verification (RBAC)
      ↓
Role-Specific Dashboard Routing
      ↓
Department & Subject Management
      ↓
Content Delivery & Bulk Processing
      ↓
Interactive Learning & Assessment
      ↓
Real-Time Analytics & Progress Tracking
```

---

## 🎯 Objectives

The main objectives of Inteleaarn are:

1. To provide a centralized hub for institutional academic and administrative operations.
2. To implement strict Role-Based Access Control (RBAC) for Administrators, Lecturers, and Students.
3. To design intuitive, role-specific dashboards and interfaces using high-fidelity UI/UX standards.
4. To automate bulk user onboarding and subject allocation via structured backend controllers.
5. To structure academic curricula into modular subjects, departments, and learning materials.
6. To ensure data integrity across users, lecturers, admins, and academic content via relational/structured database schemas.
7. To provide real-time analytics and progress tracking for institutional oversight.
8. To build a scalable, decoupled client-server architecture using RESTful APIs.

---

## ✨ Key Features

### 1. Role-Based Access Control (RBAC)

The system enforces permission boundaries across three primary user tiers:

- **Administrators:** Full system oversight, department configuration, and user directory management.
- **Lecturers:** Subject management, learning material uploads, and student performance tracking.
- **Students:** Course enrollment, interactive content access, and personal progress monitoring.

---

### 2. Bulk Data Processing & Onboarding

Administrators can efficiently manage large student cohorts and staff directories through bulk data controllers, supporting:

- Batch user registration
- Automated role assignment
- Department and batch mapping
- Validation of institutional records

---

### 3. Structured Academic Payload Representation

Users, subjects, and permissions are processed using structured JSON schemas between the Express controllers and the React frontend.

Example:

```json
{
  "subjectCode": "CIS3101",
  "subjectName": "Software Engineering",
  "department": "Computing and Information Systems",
  "assignedLecturer": {
    "lecturerId": "LEC-104",
    "name": "Academic Staff"
  },
  "modules": [
    {
      "moduleId": "MOD-01",
      "title": "System Architecture",
      "status": "Published"
    },
    {
      "moduleId": "MOD-02",
      "title": "Database Modeling",
      "status": "Draft"
    }
  ]
}
```

---

### 4. Subject & Curriculum Management

The system provides dedicated controllers for creating, updating, and archiving academic subjects:

- Department-level subject categorization
- Lecturer-to-subject assignment
- Module and resource structuring

---

### 5. Role-Specific Interactive Dashboards

Users interact with tailored workspaces built with React.js and Tailwind CSS, displaying relevant metrics, upcoming academic tasks, and quick-action controllers.

---

### 6. Secure RESTful API Architecture

Backend operations are protected through middleware chains:

- JWT-based session authentication
- Role-verification middleware
- Request payload validation
- Standardized error handling

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │   Client Browser    │
                    │  Admin / Lec / Stu  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │ Vite + Tailwind CSS │
                    └──────────┬──────────┘
                               │
                           REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Express.js Backend │
                    │       Node.js       │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
      │ Auth & RBAC │   │  API Route  │   │  Bulk Data  │
      │ Middleware  │   │ Controllers │   │  Processor  │
      └─────────────┘   └──────┬──────┘   └─────────────┘
                               │
                               ▼
                        ┌─────────────┐
                        │  Database   │
                        │Models/Schema│
                        └──────┬──────┘
                               │
                               ▼
                     ┌────────────────────┐
                     │ Role Dashboards &  │
                     │ Academic Analytics │
                     └────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| UI/UX Design | Figma |
| Frontend | React.js (Vite) |
| Styling | Tailwind CSS |
| Backend/API | Node.js + Express.js |
| Authentication | JSON Web Tokens (JWT) |
| Access Control | Custom RBAC Middleware |
| Database | MongoDB / Relational Database Schemas |
| API Architecture | RESTful API Controllers |
| Project Management | Agile Management Boards |
| Version Control | Git + GitHub |

---

## 📂 Project Structure

```text
inteleaarn/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── React + Tailwind application
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── Node.js + Express application
│
├── docs/
│   ├── architecture/
│   ├── srs/
│   └── database-schemas/
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🔄 Development Plan

### Phase 1 — Requirement Analysis & SRS

- [x] Define project scope and institutional objectives
- [x] Prepare Software Requirements Specification (SRS)
- [x] Design high-level system architecture diagram
- [x] Set up project management tracking boards

### Phase 2 — UI/UX Design

- [x] Design wireframes and high-fidelity prototypes in Figma
- [x] Establish color palettes, typography, and component tokens
- [x] Design role-specific views for Admins, Lecturers, and Students

### Phase 3 — Database & Schema Modeling

- [x] Define entity relationships and schema constraints
- [x] Create models for Users, Admins, Lecturers, and Students
- [x] Create models for Departments, Subjects, and Learning Content

### Phase 4 — Backend API & Controller Development

- [x] Configure Node.js and Express.js server
- [x] Implement JWT authentication and RBAC middleware
- [x] Develop user and admin management controllers
- [x] Implement bulk data processing endpoints
- [x] Build subject and module CRUD controllers

### Phase 5 — Frontend Implementation

- [x] Set up React.js application with Tailwind CSS
- [x] Build reusable UI components and layout wrappers
- [x] Implement role-based client routing
- [x] Integrate frontend views with Express REST APIs

### Phase 6 — Testing & Evaluation

- [x] Conduct unit and integration testing on API endpoints
- [x] Validate RBAC security boundaries across user roles
- [x] Test bulk upload performance and error handling
- [x] Conduct usability testing on dashboard workflows

---

## 🔐 Authentication & Access Flow

Inteleaarn operates with strict **token-based authentication and role verification**.

```text
User Login Request
   ↓
Credential Validation
   ↓
JWT Issuance (Contains User ID & Role)
   ↓
Protected Route Request
   ↓
RBAC Middleware Verification
   ↓
Grant / Deny Controller Access
```

This ensures users can only invoke API controllers and view interface routes explicitly permitted for their institutional role.

---

## 🔌 API Endpoints

```text
POST   /api/v1/auth/login
POST   /api/v1/auth/register

GET    /api/v1/users
POST   /api/v1/users/bulk
PUT    /api/v1/users/{id}
DELETE /api/v1/users/{id}

GET    /api/v1/subjects
POST   /api/v1/subjects
PUT    /api/v1/subjects/{id}
DELETE /api/v1/subjects/{id}

GET    /api/v1/lecturers
POST   /api/v1/lecturers/assign
```

---

## 🗄️ Database Entities

### Users

Stores core authentication credentials, profile metadata, and global role identifiers.

### Admins

Stores administrative privileges and institutional oversight metadata.

### Lecturers

Stores academic staff profiles, department affiliations, and assigned subjects.

### Subjects

Stores curriculum details, subject codes, credit values, and associated learning modules.

### Learning Content

Stores course materials, module structures, and assessment resources linked to subjects.

---

## 🧠 System Processing Pipeline

```text
Client Action (Admin / Lecturer / Student)
    ↓
React State & API Service Call
    ↓
Express Route Handler
    ↓
JWT & RBAC Security Check
    ↓
Controller Business Logic
    ↓
Database Schema Validation & Query
    ↓
Structured JSON Response
    ↓
Dynamic UI Dashboard Update
```

---

## 📊 Project Evaluation

The system is evaluated across four primary dimensions:

### Security & Access Control

- Accuracy of role permission boundaries
- Token expiration and session security
- Protection against unauthorized endpoint access

### Backend Performance

- Bulk user processing speed
- API response latency
- Database query optimization and schema integrity

### Code & Architecture Quality

- Modularity of Express controllers and routes
- Reusability of React frontend components
- Maintainability of state and API service layers

### Usability

- Clarity of role-specific dashboards
- Ease of subject and content management
- Responsiveness across desktop and mobile viewports

---

## 🚧 Current Scope

The core implementation focuses on:

```text
Institutional Setup
        ↓
Role-Based Authentication
        ↓
Bulk User & Staff Onboarding
        ↓
Subject & Curriculum Allocation
        ↓
Interactive Dashboard Operations
        ↓
Academic Progress Monitoring
```

---

## 🔮 Future Improvements

Possible future extensions include:

- AI-powered personalized study path recommendations
- Automated grading and intelligent quiz generation
- Real-time in-app messaging and discussion forums
- Live virtual classroom integration (WebRTC)
- Mobile application support (React Native / Flutter)
- Automated attendance and engagement analytics

---

## 👨‍💻 Project Status & Acknowledgments

**Status:** Capstone Project Completed / Active Refinement

**Project:** Inteleaarn (Interactive Learning Intelligent System)

**Type:** Undergraduate Group Capstone Project (Group No. 19)

**Institution:** Department of Computing and Information Systems, Sabaragamuwa University of Sri Lanka

**Industry Mentor:** Vadivel Abishethvarman (QC IT Solutions)

**Internal Supervisor:** Ms. A.W.T. Dulmini

**Primary Frontend:** React.js + Tailwind CSS

**Primary Backend:** Node.js + Express.js

---

## 📜 License

This project is developed for academic and educational purposes.
