const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Protect all student routes

router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

// Student-specific auxiliary routes
router.get('/:id/emotions', studentController.getStudentEmotions);
router.get('/:id/academic', studentController.getStudentAcademic);

module.exports = router;
