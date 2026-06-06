import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch current weather data for a given latitude and longitude.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} - Weather data
 */
export const fetchCurrentWeather = async (lat, lon) => {
  console.log('OpenWeather API Key Loaded:', API_KEY ? 'Yes' : 'No');
  
  if (!API_KEY) {
    throw new Error('OpenWeather API Key is missing. Please check your .env file.');
  }

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });

    console.log('Weather Data Fetched Successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Test function to verify OpenWeather API integration.
 * This can be called from any component to verify the setup.
 */
export const testWeatherIntegration = async () => {
  // Test coordinates: New Delhi (28.6139, 77.2090)
  const testLat = 28.6139;
  const testLon = 77.2090;

  console.log(`Testing Weather Integration for coordinates: ${testLat}, ${testLon}`);
  
  try {
    const data = await fetchCurrentWeather(testLat, testLon);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};
