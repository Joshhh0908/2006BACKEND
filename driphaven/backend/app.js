const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin'); // Add this line to import admin


const serviceAccount = require('../firebaseAdminKey.json');  // Path to your service account key
console.log('Service Account:', serviceAccount);  // Log the service account to inspect its contents

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Set Firebase for all controllers
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Import routes
const loginRoutes = require('./routes/loginRoutes');
const createAccountRoutes = require('./routes/createAccountRoutes');
const homepageRoutes = require('./routes/homepageRoutes');
const profilePageRoutes = require('./routes/profilePageRoutes');
const closetPageRoutes = require('./routes/closetPageRoutes');
const calendarPageRoutes = require('./routes/calendarPageRoutes');
const recoPageRoutes = require('./routes/recoPageRoutes');

// Authentication middleware
const authMiddleware = require('./middleware/auth');

// Routes
app.use('/', loginRoutes);
app.use('/createAccount', createAccountRoutes);

// Protected routes
app.use('/homepage', authMiddleware, homepageRoutes);
app.use('/profile', authMiddleware, profilePageRoutes);
app.use('/closet', authMiddleware, closetPageRoutes);
app.use('/calendar', authMiddleware, calendarPageRoutes);
app.use('/recommendations', authMiddleware, recoPageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
