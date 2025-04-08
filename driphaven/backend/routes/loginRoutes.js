// routes/loginRoutes.js
const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// POST /api/auth/login
router.post('/login', loginController.login);

router.get('/penis', (req, res) => {
    res.status(201).send(
    "penispenis"
    );
});
module.exports = router;
