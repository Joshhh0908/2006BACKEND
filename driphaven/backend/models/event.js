// models/event.js
class Event {
  static collection = 'users'; 

  // Get all events for a user
  static async getAll(db, userId) {
    try {
      const userDocRef = db.collection(this.collection).doc(userId);
      const calendarSubcollectionRef = userDocRef.collection('calendar');
      const snapshot = await calendarSubcollectionRef.get();

      if (snapshot.empty) {
        return []; // No events found
      }

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(), // Spread the document fields (event name, date, etc.)
        eventDate: doc.data().eventDate ? doc.data().eventDate.toDate() : null // Convert Firestore timestamp to JavaScript Date
      }));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }

  // Create a new event for a user
  static async create(db, userId, eventData) {
    try {
      console.log("Creating event for user:", userId);
      console.log("Event data:", eventData);
  
      // Reference to user's document and subcollection
      const userDocRef = db.collection(this.collection).doc(userId);
  
      // Check if user document exists
      const userDoc = await userDocRef.get();
      if (!userDoc.exists) {
        throw new Error(`User with ID ${userId} does not exist`);
      }
  
      // Reference to the calendar subcollection
      const calendarSubcollectionRef = userDocRef.collection('calendar');
  
      // Add new event to the calendar subcollection
      const newEventRef = await calendarSubcollectionRef.add({
        ...eventData,
        createdAt: new Date()  
      });
  
      console.log("Event created with ID:", newEventRef.id);
      return newEventRef.id;
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }
  

  // Update an existing event
  static async update(db, eventId, eventData, userId) {
    try {
      const userDocRef = db.collection(this.collection).doc(userId);
      const calendarSubcollectionRef = userDocRef.collection('calendar');
      const eventRef = calendarSubcollectionRef.doc(eventId);
      const doc = await eventRef.get();

      if (!doc.exists) {
        throw new Error('Event not found');
      }
      await eventRef.update({
        ...eventData,
        updatedAt: new Date() 
      });

      return { id: eventId, ...eventData };  // Return the updated event data
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  }

  // Delete an event
  static async delete(db, eventId, userId) {
    try {
      const userDocRef = db.collection(this.collection).doc(userId);
      const calendarSubcollectionRef = userDocRef.collection('calendar');
      const eventRef = calendarSubcollectionRef.doc(eventId);
      const doc = await eventRef.get();

      if (!doc.exists) {
        throw new Error('Event not found');
      }
      await eventRef.delete();
      return eventId;  // Return the deleted event's ID
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  }


    // Get a specific event by ID
    static async getById(db, eventId, userId) {
      try {
        const userDocRef = db.collection(this.collection).doc(userId);
        const calendarSubcollectionRef = userDocRef.collection('calendar');
        const eventRef = calendarSubcollectionRef.doc(eventId);
        const doc = await eventRef.get();
  
        if (!doc.exists) {
          throw new Error('Event not found');
        }
        return { id: doc.id, ...doc.data() };
      } catch (error) {
        console.error('Error fetching specific event:', error);
        throw new Error('Failed to fetch event');
      }
    }
}



module.exports = Event;
