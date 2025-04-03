// models/weather.js
const axios = require('axios');

class Weather {
  static API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
  static BASE_URL = 'https://api.openweathermap.org/data/2.5';

  static async getByLocation(location) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/weather?q=${location}&units=metric&appid=${this.API_KEY}`
      );
      
      const data = response.data;
      
      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        condition: this.getCondition(data.weather[0].id),
        uvIndex: await this.getUVIndex(data.coord.lat, data.coord.lon),
        alert: this.getWeatherAlert(data.main.temp, data.weather[0].id)
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Return default values if API call fails
      return {
        temperature: 25,
        humidity: 65,
        windSpeed: 10,
        uvIndex: 5,
        condition: 'sunny',
        alert: null
      };
    }
  }

  static getCondition(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return 'stormy';
    if (weatherId >= 300 && weatherId < 600) return 'rainy';
    if (weatherId >= 600 && weatherId < 700) return 'snowy';
    if (weatherId >= 700 && weatherId < 800) return 'foggy';
    if (weatherId === 800) return 'sunny';
    if (weatherId > 800) return 'cloudy';
    return 'sunny';
  }

  static async getUVIndex(lat, lon) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${this.API_KEY}`
      );
      
      return Math.round(response.data.value);
    } catch (error) {
      return 5; // Default value
    }
  }

  static getWeatherAlert(temp, weatherId) {
    if (temp > 30) return 'Hot weather predicted, remember to wear sunscreen!';
    if (temp < 5) return 'Cold weather predicted, dress warmly!';
    if (weatherId >= 200 && weatherId < 300) return 'Thunderstorms predicted, stay indoors if possible!';
    if (weatherId >= 300 && weatherId < 600) return 'Rain predicted, remember to bring an umbrella!';
    if (weatherId >= 600 && weatherId < 700) return 'Snow predicted, dress warmly!';
    return null;
  }
}

module.exports = Weather;