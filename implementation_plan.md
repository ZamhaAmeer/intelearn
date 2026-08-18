# Implementation Plan - Intelearn Admin Web Panel & Secure API

This plan outlines the architecture split and implementation steps to construct the Intelearn Admin Panel as an independent React.js web application, while updating the Node.js/Express backend and PostgreSQL database to handle secure admin sign-up, verification, password resets, and a restricted 4-emotion tracking system.

---

## User Review Required

> [!IMPORTANT]
> **Architectural Separation**: 
> * The Admin Panel is completely extracted from the mobile application. The old Expo screens inside `app/admin/` will be bypassed or cleaned up, and the new web dashboard will reside in a new root-level directory: `admin-panel/`.
> * The admin web panel runs locally via Vite on `http://localhost:5173`.
> * The mobile app continues to run through Expo Go using `npx expo start` without any configuration changes.

> [!WARNING]
> **Strict 4-Emotion Restructure**:
> * We will modify the database schema and controllers to enforce a strict 4-emotion system: **Happy, Sad, Neutral, Frustrated**.
> * The previous `Calm`, `Angry`, `Anxious`, and `Stressed` emotions will be deleted.
> * Seeding scripts and controllers will classify `Sad` and `Frustrated` as well-being risk states, while `Happy` and `Neutral` will be classified as positive/neutral states.

> [!IMPORTANT]
> **Mock Email Dispatcher**:
> * Since we are running in a local development environment, we will implement the email verification and password reset dispatch logic in the backend. 
> * For ease of local testing, emails will be printed to the backend console terminal (containing the direct verification / reset links) in addition to trying to send them through a local SMTP setup, so the developer can immediately copy and paste the verification URLs into their browser.

---

## Proposed Changes

We will modify/create the following files in the project workspace:

### 1. Database & Migrations

#### [NEW] [migrate_admin_security.sql](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/backend/db/migrate_admin_security.sql)
* SQL script to add security fields to the `admin_users` table:
  * `is_verified` (BOOLEAN, default false)
  * `verification_token` (VARCHAR)
  * `verification_token_expires` (TIMESTAMP)
  * `reset_password_token` (VARCHAR)
  * `reset_password_expires` (TIMESTAMP)
  * `last_login` (TIMESTAMP)
  * `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

#### [MODIFY] [schema.sql](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/backend/db/schema.sql)
* Update the table definitions to incorporate the secure admin fields.
* Restrict the check constraint of `detected_emotion` on `emotional_reports` to: `Happy`, `Sad`, `Neutral`, `Frustrated`.

#### [MODIFY] [seed.js](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/backend/db/seed.js)
* Update default seeded administrator (`admin`/`admin123`) to have `is_verified = true`.
* Update emotional reports mock data to only contain: `Happy`, `Sad`, `Neutral`, `Frustrated`.

---

### 2. Node.js Express Backend

#### [NEW] [adminAuthMiddleware.js](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/backend/middleware/adminAuthMiddleware.js)
* Midddleware to verify JWT and restrict endpoint access:
  * `authenticateAdmin`: Decodes JWT token and validates that the admin account is verified (`is_verified = true`).
  * `requireAdminRole`: Asserts `role === 'admin'`.

#### [NEW] [adminRoutes.js](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/backend/routes/adminRoutes.js)
* Standardize admin panel routes mounted at `/api/admin`:
  * Mount auth endpoints (`/auth/signup`, `/auth/verify-email`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/change-password`, `/auth/logout`, `/auth/me`).
  * Mount CRUD endpoints for `students`, `lecturers`, `faculties`, `resources`, `announcements`.
  * Mount analytics dashboards `/emotions/...` and `/dashboard/...`.
  * All routes (except initial signup, email verify, login, and forgot/reset password) will be protected by `authenticateAdmin`.

#### [NEW] [adminController.js](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/backend/controllers/adminController.js)
* Controller handling admin authentication flow:
  * Validate password strength (min 8 chars, uppercase, lowercase, number, special char).
  * Generate cryptographically secure tokens.
  * Send email verifications (console log for easy local sandbox copy).
  * Register new admin profiles with hashed passwords.

#### [MODIFY] [emotionController.js](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/backend/controllers/emotionController.js)
* Modify emotion analysis queries:
  * Group/Filter by `Happy`, `Sad`, `Neutral`, `Frustrated` only.
  * Flag negative reports when emotion is `Sad` or `Frustrated`.

#### [MODIFY] [server.js](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/backend/server.js)
* Register the new admin routes: `app.use('/api/admin', adminRoutes)`.

---

### 3. React Web Application (Vite Frontend)

#### [NEW] [package.json](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/admin-panel/package.json)
* Vite React configuration. Adds `react-router-dom` for routing, `axios` for requests, `recharts` for charts, and `lucide-react` for dashboard icons.

#### [NEW] [index.html](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/admin-panel/index.html)
* Base web page viewport matching a professional university theme.

#### [NEW] [global.css](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/admin-panel/src/styles/global.css)
* Design system using CSS variables: HSL colors (purples/blues), collapsible flex sidebar grid, responsive layouts, forms, buttons, inputs, alerts, and tables.

#### [NEW] [AuthContext.jsx](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/admin-panel/src/context/AuthContext.jsx)
* State provider for handling global token store, profile fetching, login, logout, and token session persistence.

#### [NEW] [AppRoutes.jsx](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/admin-panel/src/routes/AppRoutes.jsx)
* Configures paths and wraps private screens in the `ProtectedRoute` shell.

#### [NEW] [Sidebar.jsx](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/admin-panel/src/components/Sidebar.jsx) & [Header.jsx](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/admin-panel/src/components/Header.jsx)
* Sidebar that collapses on mobile viewports.
* Header featuring the current screen title, notifications indicator, and active administrator profile.

#### [NEW] [DataTable.jsx](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/admin-panel/src/components/DataTable.jsx)
* Reusable data grid with pagination, filters, and standard search wrappers.

#### [NEW] [auth pages (AdminLogin, AdminSignup, VerifyEmail, ForgotPassword, ResetPassword)](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/admin-panel/src/pages/auth)
* Fully functional pages mapping form submissions to REST backend services, displaying strength gauges and detailed feedback.

#### [NEW] [admin pages (Dashboard, Students, StudentProfile, Lecturers, Faculties, EmotionalAnalytics, LearningResources, Announcements, Settings)](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn/admin-panel/src/pages/admin)
* Interactive pages for CRUD control panels, chart renderings via Recharts, and flagging repeated negative logs for academic counseling attention.

---

## Verification Plan

### Automated Tests
* Propose a shell command to test backend authentication APIs using curl/powershell.
* Ensure database table constraints compile.

### Manual Verification
1. **Migrations**: Verify migration query execution in PostgreSQL.
2. **Registration and Verification**: Register a new admin account via `/admin/signup`, retrieve the verification link printed in the Node terminal console, visit it, and verify that the account status switches to active.
3. **Login**: Login with the verified admin. Confirm that the dashboard loads stats fetched from PostgreSQL.
4. **Risk Alerts**: Verify that students with 2 or more reports of `Sad`/`Frustrated` show in the risk panels.
5. **Responsive Check**: Scale browser window down to confirm sidebar collapses into top navigation menu.
