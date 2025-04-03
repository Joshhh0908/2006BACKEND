// routes/createAccountRoutes.js
const express = require('express');
const router = express.Router();
const createAccountController = require('../controllers/createAccountController');

// POST /api/register
router.post('/', createAccountController.register);

module.exports = router;