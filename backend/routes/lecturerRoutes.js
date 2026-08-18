const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Protect all lecturer routes

router.get('/', lecturerController.getAllLecturers);
router.get('/:id', lecturerController.getLecturerById);
router.post('/', lecturerController.createLecturer);
router.put('/:id', lecturerController.updateLecturer);
router.delete('/:id', lecturerController.deleteLecturer);
router.put('/:id/assign', lecturerController.assignFaculty);

module.exports = router;
