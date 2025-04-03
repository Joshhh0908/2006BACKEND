// models/event.js

const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore(); // Assuming you're using Firestore

// Get all events for a user
const getAll = async (db, userId) => {
  const eventsRef = db.collection('events').where('userId', '==', userId);
  const snapshot = await eventsRef.get();
  if (snapshot.empty) {
    return []; // No events found
  }

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get a specific event by ID
const getById = async (db, eventId, userId) => {
  const eventRef = db.collection('events').doc(eventId);
  const doc = await eventRef.get();

  if (!doc.exists || doc.data().userId !== userId) {
    throw new Error('Event not found or you do not have permission to access this event');
  }

  return { id: doc.id, ...doc.data() };
};

// Create a new event
const create = async (db, eventData) => {
  const eventRef = await db.collection('events').add(eventData);
  return eventRef.id;
};

// Update an existing event
const update = async (db, eventId, eventData, userId) => {
  const eventRef = db.collection('events').doc(eventId);
  const doc = await eventRef.get();

  if (!doc.exists || doc.data().userId !== userId) {
    throw new Error('Event not found or you do not have permission to update this event');
  }

  await eventRef.update(eventData);
  return { id: eventId, ...eventData };
};

// Delete an event
const deleteEvent = async (db, eventId, userId) => {
  const eventRef = db.collection('events').doc(eventId);
  const doc = await eventRef.get();

  if (!doc.exists || doc.data().userId !== userId) {
    throw new Error('Event not found or you do not have permission to delete this event');
  }

  await eventRef.delete();
};

module.exports = { getAll, getById, create, update, deleteEvent };
