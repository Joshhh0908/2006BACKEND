// middleware/auth.js
const { getAuth } = require('firebase-admin/auth');

module.exports = async (req, res, next) => {
  try {
    // Extract token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify token
    const decodedToken = await getAuth().verifyIdToken(token);
    req.userId = decodedToken.uid;
    
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};