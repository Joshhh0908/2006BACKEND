// controllers/loginController.js
const User = require('../models/user');

exports.login = async (req, res) => {
  try {
    // The actual authentication is handled by Firebase Client SDK
    // This endpoint just verifies the token and returns user data
    
    const userId = req.userId; // Set by auth middleware
    
    // Get user data from Firestore
    const userData = await User.getById(req.db, userId);
    
    res.status(200).json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Login failed', 
      error: error.message 
    });
  }
};