const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Protect all faculty routes

router.get('/', facultyController.getAllFaculties);
router.get('/:id', facultyController.getFacultyById);
router.post('/', facultyController.createFaculty);
router.put('/:id', facultyController.updateFaculty);
router.delete('/:id', facultyController.deleteFaculty);
router.get('/:id/lecturers', facultyController.getFacultyLecturers);

module.exports = router;
