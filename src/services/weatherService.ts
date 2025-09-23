// To use Google Weather API, you'll need to enable the Places API and Geocoding API in your Google Cloud Console
// and create an API key with the appropriate permissions.

import { WeatherData } from '@/store/appStore';

export const getWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    // Use a fallback location name if geocoding fails
    let locationName = 'Unknown Location';
    
    try {
      const geocodeResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.VITE_GOOGLE_API_KEY}`
      );
      const geocodeData = await geocodeResponse.json();
      if (geocodeData.results && geocodeData.results.length > 0) {
        locationName = geocodeData.results[0].formatted_address;
      }
    } catch (error) {
      console.warn('Error fetching location name:', error);
    }

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.VITE_OPENWEATHER_API_KEY}&units=metric`
    );
    
    if (!weatherResponse.ok) {
      throw new Error(`Weather API returned ${weatherResponse.status}`);
    }
    
    const weatherData = await weatherResponse.json();
    
    if (!weatherData.weather?.[0]) {
      throw new Error('Invalid weather data received');
    }

    return {
      condition: weatherData.weather[0].main,
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      location: {
        lat,
        lon,
        name: locationName,
      },
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const getCurrentLocation = (): Promise<GeolocationPosition> => 
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });