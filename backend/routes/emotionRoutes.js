const express = require('express');
const router = express.Router();
const emotionController = require('../controllers/emotionController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Protect all emotional analytics routes

router.get('/reports', emotionController.getAllReports);
router.get('/trends', emotionController.getTrends);
router.get('/alerts', emotionController.getRiskAlerts);

module.exports = router;
