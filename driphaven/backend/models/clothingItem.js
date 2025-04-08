// models/clothingItem.js
class ClothingItem {
    static collection = 'users';
  
    static async getAll(db, userId) {
      try {
        // Reference to the user's profile subcollection
        const userDocRef = db.collection(this.collection).doc(userId);
        const closetSubcollectionRef = userDocRef.collection("closet");
        const snapshot = await closetSubcollectionRef.get();

        if (snapshot.empty) {
          return [];
        }
        // Map over the snapshot documents and format the data
        return snapshot.docs.map(doc => ({
          id: doc.id,  // Get the clothing item document ID
          ...doc.data(),  // Spread the document fields (e.g., clothingType, size, etc.)
          lastWorn: doc.data().lastWorn ? doc.data().lastWorn.toDate() : null,  // Convert Firestore timestamp to JavaScript Date
          createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : null  // Convert Firestore timestamp to JavaScript Date (if exists)
        }));
      } catch (error) {
        console.error('Error fetching closet items:', error);
        throw new Error('Failed to fetch closet items');
      }
    }
  
    static async create(db, itemData, userId) {
      const docRef = db.collection(this.collection).doc(userId);
      const closetSubcollection = docRef.collection("closet");
      const newItemRef = await closetSubcollection.add({
        ...itemData,
        lastWorn: new Date(),
        createdAt: new Date()
      });
      
      return newItemRef.id;
    }
  
    static async update(db, itemId, itemData, userId) {
      const docRef = db.collection(this.collection).doc(userId);
      const closetSubcollection = docRef.collection("closet");
      const item = closetSubcollection.doc(itemId);
      const doc = await item.get();
      
      if (!doc.exists) {
        throw new Error('Clothing item not found');
      }
      
      if (doc.data().userId !== userId) {
        throw new Error('Unauthorized');
      }
      
      const updateData = {
        ...itemData,
        updatedAt: new Date()
      };
      
      await item.update(updateData);
      return itemId;
    }
  
    static async delete(db, itemId, userId) {
      const docRef = db.collection(this.collection).doc(userId);
      const closetSubcollection = docRef.collection("closet");
      const item = closetSubcollection.doc(itemId);
      const doc = await item.get();
  
      if (!doc.exists) {
        throw new Error('Clothing item not found');
      }
      
      if (doc.data().userId !== userId) {
        throw new Error('Unauthorized');
      }
      
      await item.delete();
      return itemId;
    }
  
    static async getUnused(db, userId, daysThreshold = 30) {
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);
      
      const snapshot = await db.collection(this.collection)
        .where('userId', '==', userId)
        .where('lastWorn', '<', thresholdDate)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastWorn: doc.data().lastWorn ? doc.data().lastWorn.toDate() : null
      }));
    }
  }
  
  module.exports = ClothingItem;