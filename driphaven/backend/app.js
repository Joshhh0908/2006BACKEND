// routes/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../firebaseAdminKey.json');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
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
app.use('/api/register', createAccountRoutes);

// Protected routes
app.use('/api/homepage', authMiddleware, homepageRoutes);
app.use('/api/profile', authMiddleware, profilePageRoutes);
app.use('/api/closet', authMiddleware, closetPageRoutes);
app.use('/api/calendar', authMiddleware, calendarPageRoutes);
app.use('/api/recommendations', authMiddleware, recoPageRoutes);

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