// controllers/calendarController.js
const Event = require('../models/event');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const userId = req.userId; 
    const events = await Event.getAll(req.db, userId);
    res.status(200).json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch events', 
      error: error.message 
    });
  }
};

// Add a new event
exports.addEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const eventData = {
      ...req.body,
      userId
    };
    const eventId = await Event.create(req.db, userId, eventData);
    res.status(201).json({ 
      success: true, 
      message: 'Event added successfully',
      eventId
    });
  } catch (error) {
    console.error('Add event error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to add event', 
      error: error.message 
    });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const { eventId } = req.params;
    const eventData = req.body;
    
    // Update event
    await Event.update(req.db, eventId, eventData, userId);
    
    res.status(200).json({ 
      success: true, 
      message: 'Event updated successfully' 
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update event', 
      error: error.message 
    });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const { eventId } = req.params;
    
    // Delete event
    await Event.delete(req.db, eventId, userId);
    
    res.status(200).json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete event', 
      error: error.message 
    });
  }
};




// Get a single event by ID
exports.getEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const { eventId } = req.params;
    
    // Get event by ID
    const event = await Event.getById(req.db, eventId, userId);
    
    res.status(200).json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch event', 
      error: error.message 
    });
  }
};
