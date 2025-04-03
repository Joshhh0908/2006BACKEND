// routes/calendarPageRoutes.js
const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

// Get all events
router.get('/', calendarController.getAllEvents);

// Get a specific event by ID
router.get('/:eventId', calendarController.getEvent);

// Add a new event
router.post('/', calendarController.addEvent);

// Update an existing event
router.put('/:eventId', calendarController.updateEvent);

// Delete an event
router.delete('/:eventId', calendarController.deleteEvent);

module.exports = router;
