// models/user.js
class User {
  static collection = 'users';

  static async create(db, userData) {
    // Reference to the user document in the "users" collection
    const userDocRef = db.collection(this.collection).doc(userData.uid);
    
    // Set basic user data in the user document (only email and username)
    await userDocRef.set({
      email: userData.email || '',
      createdAt: new Date()
    });
  
    // Reference to the profile subcollection under the user document
    const profileSubcollectionRef = userDocRef.collection('profile');
    
    // Add the full profile data to the profile subcollection (including email, username, and other fields)
    await profileSubcollectionRef.add({
      username: userData.username || '',
      email: userData.email || '',
      gender: '',        
      ageGroup: '',      
      occupation: '',    
      preferredStyle: '',
      createdAt: new Date()  
    });
  
    return userData.uid;
  }
  
  
  static async getById(db, userId) {
    if (!userId) {
      throw new Error('userId is required');
    }
  
    // Reference to the user document
    const userDocRef = db.collection(this.collection).doc(userId);
    console.log('Fetching userDoc for:', userDocRef.path);  // Log the document path
  
    const userDoc = await userDocRef.get();
    console.log('User document fetched:', userDoc.exists);  // Log whether the document exists
  
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
  
    // Fetch the user's profile subcollection
    const profileSnapshot = await userDocRef.collection('profile').get();
    console.log('Profile snapshot empty:', profileSnapshot.empty);  // Log if profile is empty
  
    if (profileSnapshot.empty) {
      throw new Error('Profile not found');
    }
  
    const profileData = profileSnapshot.docs[0].data();
    console.log('Profile Data:', profileData);  // Log the profile data
  
    const userData = {
      profile: profileData  // Add profile data to the returned object
    };
  
    return userData;
  }


  static async update(db, userId, profileData) {
    // Reference to profile doc path
    const userDocRef = db.collection(this.collection).doc(userId);
    const profileSubcollectionRef = userDocRef.collection('profile');
    const profileSnapshot = await profileSubcollectionRef.get();
  
    // If see this then probably is creatingAccount fuck up
    if (profileSnapshot.empty) {
      throw new Error('Profile document not found');
    }

    const profileDocRef = profileSnapshot.docs[0].ref;  // Reference to the profile document
    
    // Unpack profileData coming in and update
    const updateData = {
      ...profileData,
      updatedAt: new Date() 
    };
  
    await profileDocRef.update(updateData);
    
    return userId;
  }  
  }
  
  module.exports = User;