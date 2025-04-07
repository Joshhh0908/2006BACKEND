// controllers/profileController.js
const User = require('../models/user');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get user data from Firestore
    const userData = await User.getById(req.db, userId);
    
    res.status(200).json(userData);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch profile', 
      error: error.message 
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { username, email, gender, ageGroup, occupation, preferredStyle } = req.body;
    const profileData = {
      username: username || '',        
      gender: gender || '',     
      ageGroup: ageGroup || '', 
      occupation: occupation || '', 
      preferredStyle: preferredStyle || '', 
      updatedAt: new Date() 
    };
    
    await User.update(req.db, userId, profileData);
    
    res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update profile', 
      error: error.message 
    });
  }
};