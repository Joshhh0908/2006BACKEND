// models/user.js
class User {
    static collection = 'users';
  
    static async create(db, userData) {
      const docRef = db.collection(this.collection).doc(userData.uid);
      await docRef.set({
        username: userData.username,
        email: userData.email,
        gender: userData.gender || '',
        ageGroup: userData.ageGroup || '',
        occupation: userData.occupation || '',
        preferredStyle: userData.preferredStyle || '',
        createdAt: new Date()
      });
      return userData.uid;
    }
  
    static async getById(db, userId) {
      const docRef = db.collection(this.collection).doc(userId);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw new Error('User not found');
      }
      
      return { id: doc.id, ...doc.data() };
    }
  
    static async update(db, userId, userData) {
      const docRef = db.collection(this.collection).doc(userId);
      const updateData = {
        ...userData,
        updatedAt: new Date()
      };
      
      await docRef.update(updateData);
      return userId;
    }
  }
  
  module.exports = User;