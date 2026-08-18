# Intelearn Admin Panel Walkthrough

We have created the administrative portal interface and database backend for the **Intelearn University Student Support Application**. All components have been built matching the requested academic purple theme, using functional React hooks, and incorporating real-time database interfaces.

---

## Created Components & Architecture

Below is the directory mapping of everything we built inside [C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn](file:///C:/Users/Mathusa/OneDrive/Documents/GitHub/intelearn):

```
intelearn/
├── backend/
│   ├── config/
│   │   └── db.js                 # PostgreSQL connection pool using 'pg'
│   ├── controllers/
│   │   ├── authController.js     # Admin login, token signing, profile configurations
│   │   ├── dashboardController.js# aggregates statistics counts & logs recent activities
│   │   ├── studentController.js  # CRUD profiles + emotional logs history + GPA progress
│   │   ├── lecturerController.js # CRUD staff profiles + faculty assignment hooks
│   │   ├── facultyController.js  # CRUD directories + details pages
│   │   ├── emotionController.js  # compiles metrics + lists support flags (Risk Alerts)
│   │   ├── resourceController.js # CRUD study materials uploads
│   │   └── announcementController.js # publishes notification posts
│   ├── db/
│   │   ├── schema.sql            # PostgreSQL DDL table definitions (7 tables)
│   │   └── seed.js               # Node database seeder with secure hashed password
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verifier checking Authorization header Bearer tokens
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   ├── dashboardRoutes.js    # /api/dashboard endpoints
│   │   ├── studentRoutes.js      # /api/students endpoints
│   │   ├── lecturerRoutes.js     # /api/lecturers endpoints
│   │   ├── facultyRoutes.js      # /api/faculties endpoints
│   │   ├── emotionRoutes.js      # /api/emotions endpoints
│   │   ├── resourceRoutes.js     # /api/resources endpoints
│   │   └── announcementRoutes.js # /api/announcements endpoints
│   ├── .env                      # environment port, secrets, and credentials
│   ├── package.json              # backend dependencies list
│   └── server.js                 # API server entry file
└── app/
    ├── choosingpage.jsx          # [MODIFIED] added 'Administrator Access' route link
    └── admin/
        ├── components/
        │   ├── DashboardCard.jsx # Reusable stats card displaying metrics and trends
        │   └── DataTable.jsx     # Reusable search-enabled horizontal list tables
        ├── services/
        │   └── api.js            # Axios client mapping with bearer token interceptors
        ├── _layout.jsx           # Responsive shell (Desktop Left Sidebar / Mobile Drawer)
        ├── index.jsx             # Admin Login panel Screen
        ├── dashboard.jsx         # Analytics overview screen
        ├── students.jsx          # Student profiles CRUD and emotional history view
        ├── lecturers.jsx         # Lecturer profiles CRUD and faculty allocations
        ├── faculties.jsx         # Faculty directory, Deans list, and departments info pages
        ├── emotions.jsx          # Well-being analytics and Flagged student Risk Alerts
        ├── resources.jsx         # Study materials database with picking attachments
        ├── announcements.jsx     # Broad notification alerts publisher
        └── settings.jsx          # Profile credentials updates and system controls
```

---

## Getting Started

### 1. Database Setup & Seeding

Make sure PostgreSQL is running on your machine. You can create a database called `intelearn` inside pgAdmin 4.
Update your database credentials inside `backend/.env`:
```
DB_USER=postgres
DB_PASSWORD=<your_password>
DB_NAME=intelearn
```

Navigate to the `backend/` folder and run the database seeder to construct the tables and seed mock profiles:
```bash
cd backend
npm install
node db/seed.js
```
> [!NOTE]
> The seeder hashes the default admin password. You can login with:
> - **Username**: `admin`
> - **Password**: `admin123`

### 2. Run the Express Backend

Start the Node development API server:
```bash
npm run dev
```
The server will boot up and print:
`Intelearn API server is running on port 3000`

### 3. Run the React Native Frontend

We added the `axios` dependency to your React Native application. Run:
```bash
npm run web
# or
npm run start
```
From the main landing screen of **Intelearn**, click the new **Administrator Access** option. Login with `admin` / `admin123` to open the Admin Panel!

---

## Key Feature Implementation Highlights

1. **Responsive Side Drawer (`app/admin/_layout.jsx`)**:
   - Renders a stationary left navigation column on desktop screens.
   - Automatically switches to an overlay slide-out drawer triggered by a header hamburger menu on mobile screens.

2. **Proactive Risk Alerts (`app/admin/emotions.jsx`)**:
   - Aggregates logs in the database to identify students reporting multiple consecutive negative moods (`Stressed`, `Anxious`, `Sad`, or `Angry`).
   - Flags them with red warning widgets displaying active trigger explanations, helping lecturers and academic counselors respond proactively.

3. **Study Materials Picker (`app/admin/resources.jsx`)**:
   - Uses `expo-document-picker` to simulate uploading PDF documents and video lectures, automatically mapping generated paths into the learning materials table.
