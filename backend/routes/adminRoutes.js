const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('../controllers/adminController');
const studentController = require('../controllers/studentController');
const lecturerController = require('../controllers/lecturerController');
const facultyController = require('../controllers/facultyController');
const emotionController = require('../controllers/emotionController');
const resourceController = require('../controllers/resourceController');
const announcementController = require('../controllers/announcementController');
const dashboardController = require('../controllers/dashboardController');

// Security Middlewares
const { authenticateAdmin, requireAdminRole } = require('../middleware/adminAuthMiddleware');

// --------------------------------------------------
// PUBLIC AUTH ENDPOINTS
// --------------------------------------------------
router.post('/auth/signup', adminController.signup);
router.post('/auth/verify-email', adminController.verifyEmail);
router.post('/auth/login', adminController.login);
router.post('/auth/forgot-password', adminController.forgotPassword);
router.post('/auth/reset-password', adminController.resetPassword);

// --------------------------------------------------
// PROTECTED ADMINISTRATIVE ENDPOINTS
// (All subsequent routes require valid JWT + admin role)
// --------------------------------------------------
router.use(authenticateAdmin);
router.use(requireAdminRole);

// Admin Auth Session
router.put('/auth/change-password', adminController.changePassword);
router.get('/auth/me', adminController.getMe);
router.post('/auth/logout', (req, res) => {
  res.json({ message: 'Session ended successfully. Client token discarded.' });
});

// Dashboard Analytics Summaries
router.get('/dashboard/statistics', dashboardController.getStats);

// Student Profile Directory & CRUD
router.get('/students', studentController.getAllStudents);
router.get('/students/:id', studentController.getStudentById);
router.post('/students', studentController.createStudent);
router.put('/students/:id', studentController.updateStudent);
router.delete('/students/:id', studentController.deleteStudent);
router.get('/students/:id/emotions', studentController.getStudentEmotions);
router.get('/students/:id/academic', studentController.getStudentAcademic);

// Lecturer Profiles & Faculty Allocation
router.get('/lecturers', lecturerController.getAllLecturers);
router.get('/lecturers/:id', lecturerController.getLecturerById);
router.post('/lecturers', lecturerController.createLecturer);
router.put('/lecturers/:id', lecturerController.updateLecturer);
router.delete('/lecturers/:id', lecturerController.deleteLecturer);
router.put('/lecturers/:id/assign', lecturerController.assignFaculty);

// Faculty & Department Directories
router.get('/faculties', facultyController.getAllFaculties);
router.get('/faculties/:id', facultyController.getFacultyById);
router.post('/faculties', facultyController.createFaculty);
router.put('/faculties/:id', facultyController.updateFaculty);
router.delete('/faculties/:id', facultyController.deleteFaculty);
router.get('/faculties/:id/lecturers', facultyController.getFacultyLecturers);

// Emotional Detection Analytics & Alerts
router.get('/emotions/reports', emotionController.getAllReports);
router.get('/emotions/trends', emotionController.getTrends);
router.get('/emotions/alerts', emotionController.getRiskAlerts);

// Learning Resources Files Directory
router.get('/resources', resourceController.getAllResources);
router.get('/resources/:id', resourceController.getResourceById);
router.post('/resources', resourceController.createResource);
router.put('/resources/:id', resourceController.updateResource);
router.delete('/resources/:id', resourceController.deleteResource);

// Announcements Board
router.get('/announcements', announcementController.getAllAnnouncements);
router.get('/announcements/:id', announcementController.getAnnouncementById);
router.post('/announcements', announcementController.createAnnouncement);
router.put('/announcements/:id', announcementController.updateAnnouncement);
router.delete('/announcements/:id', announcementController.deleteAnnouncement);

module.exports = router;
