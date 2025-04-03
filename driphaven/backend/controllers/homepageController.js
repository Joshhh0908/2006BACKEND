// controllers/homepageController.js
const Weather = require('../models/weather');
const Event = require('../models/event');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get weather data
    const weatherData = await Weather.getByLocation('Singapore'); // Default location
    
    // Get upcoming events
    const upcomingEvents = await Event.getUpcoming(req.db, userId, 3);
    
    // Get trending styles (would typically come from a database)
    const trendingStyles = [
      {
        id: 1,
        title: 'Minimalist Chic',
        description: 'Clean lines & neutral tones',
        icon: 'tshirt'
      },
      {
        id: 2,
        title: 'Vintage Revival',
        description: '90s inspired looks',
        icon: 'vest'
      },
      {
        id: 3,
        title: 'Bold Prints',
        description: 'Statement patterns',
        icon: 'hat-cowboy'
      }
    ];
    
    // Get care guides (would typically come from a database)
    const careGuides = [
      {
        id: 1,
        material: 'Cotton',
        care: 'Machine wash cold, tumble dry low',
        icon: 'tshirt'
      },
      {
        id: 2,
        material: 'Wool',
        care: 'Hand wash cold, lay flat to dry',
        icon: 'socks'
      },
      {
        id: 3,
        material: 'Silk',
        care: 'Dry clean only, store in cool place',
        icon: 'vest'
      }
    ];
    
    res.status(200).json({
      weatherData,
      upcomingEvents,
      trendingStyles,
      careGuides
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch dashboard data', 
      error: error.message 
    });
  }
};