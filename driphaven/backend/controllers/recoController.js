// controllers/recoController.js
const Recommendation = require('../models/recommendation');
const Weather = require('../models/weather');

exports.generateRecommendation = async (req, res) => {
  try {
    const userId = req.userId;
    const { 
      occasion, 
      location, 
      colorPreference, 
      layers, 
      fabricPreference 
    } = req.body;
    
    // Get weather data for the location
    const weatherData = await Weather.getByLocation(location || 'Singapore');
    
    // Generate outfit recommendation
    const recommendation = await Recommendation.generateOutfit(req.db, userId, {
      occasion, 
      temperature: weatherData.temperature,
      condition: weatherData.condition,
      colorPreference, 
      layers, 
      fabricPreference,
      weatherData
    });
    
    res.status(200).json({
      recommendation,
      weatherInfo: {
        temperature: weatherData.temperature,
        condition: weatherData.condition,
        precipitation: weatherData.precipitation || '10%' // Default value
      }
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate recommendation', 
      error: error.message 
    });
  }
};

exports.getRecommendation = async (req, res) => {
  try {
    const userId = req.userId;
    const { recId } = req.params;
    
    // Get recommendation by ID
    const recommendation = await Recommendation.getById(req.db, recId, userId);
    
    res.status(200).json(recommendation);
  } catch (error) {
    console.error('Get recommendation error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch recommendation', 
      error: error.message 
    });
  }
};