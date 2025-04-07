// controllers/createAccountController.js
const User = require('../models/user');

exports.register = async (req, res) => {
  console.log("Request Body: ", req.body)
  try {
    const { uid, username, email } = req.body;
    
    // Create user document in Firestore
    const userId = await User.create(req.db, {
      uid,
      username,
      email
    });
        
    res.status(201).json({
      success: true,
      userId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Registration failed', 
      error: error.message 
    });
  }
};