// routes/profilePageRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// GET /api/profile
router.get('/', profileController.getProfile);

// PUT /api/profile
router.put('/', profileController.updateProfile);

module.exports = router;