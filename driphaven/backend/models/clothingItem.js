// models/clothingItem.js
class ClothingItem {
    static collection = 'clothingItems';
  
    static async getAll(db, userId) {
      const snapshot = await db.collection(this.collection)
        .where('userId', '==', userId)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastWorn: doc.data().lastWorn ? doc.data().lastWorn.toDate() : null
      }));
    }
  
    static async getById(db, itemId, userId) {
      const docRef = db.collection(this.collection).doc(itemId);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw new Error('Clothing item not found');
      }
      
      const data = doc.data();
      
      if (data.userId !== userId) {
        throw new Error('Unauthorized');
      }
      
      return { 
        id: doc.id, 
        ...data,
        lastWorn: data.lastWorn ? data.lastWorn.toDate() : null
      };
    }
  
    static async create(db, itemData) {
      const docRef = await db.collection(this.collection).add({
        ...itemData,
        lastWorn: new Date(),
        createdAt: new Date()
      });
      
      return docRef.id;
    }
  
    static async update(db, itemId, itemData, userId) {
      const docRef = db.collection(this.collection).doc(itemId);
      const doc = await docRef.get();
      
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
      
      await docRef.update(updateData);
      return itemId;
    }
  
    static async delete(db, itemId, userId) {
      const docRef = db.collection(this.collection).doc(itemId);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw new Error('Clothing item not found');
      }
      
      if (doc.data().userId !== userId) {
        throw new Error('Unauthorized');
      }
      
      await docRef.delete();
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