const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const studentRoutes = require('./routes/studentRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const emotionRoutes = require('./routes/emotionRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/lecturers', lecturerRoutes);
app.use('/api/faculties', facultyRoutes);
app.use('/api/emotions', emotionRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/admin', adminRoutes);

// Test root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Intelearn Admin Panel API Service.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Intelearn API server is running on port ${PORT}`);
});
