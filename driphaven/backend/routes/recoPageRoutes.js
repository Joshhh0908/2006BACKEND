// routes/recoPageRoutes.js
const express = require('express');
const router = express.Router();
const recoController = require('../controllers/recoController');

// POST /api/recommendations/generate
router.post('/generate', recoController.generateRecommendation);

// GET /api/recommendations/:recId
router.get('/:recId', recoController.getRecommendation);

module.exports = router;