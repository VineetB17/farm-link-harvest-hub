
import React, { useState, useEffect } from 'react';
import { Search, CloudRain, Loader, Wind, Droplets, Thermometer } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from "@/components/ui/card";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
}

interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
}

const API_KEY = 'ad574d500e8afe03c826bee2296669ad';

const WeatherWidget: React.FC = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const { toast } = useToast();

  // Get user's location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Fetch weather based on user's location
  useEffect(() => {
    if (userLocation) {
      fetchWeatherByCoords(userLocation.lat, userLocation.lon);
      fetchForecastByCoords(userLocation.lat, userLocation.lon);
    }
  }, [userLocation]);

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Error fetching weather data');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch weather for your location.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchForecastByCoords = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&cnt=5`
      );
      
      if (!response.ok) {
        throw new Error('Error fetching forecast data');
      }
      
      const data = await response.json();
      setForecastData(data);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  };

  const fetchWeatherData = async (cityName: string) => {
    if (!cityName) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      setWeatherData(data);
      
      // Also fetch forecast data
      fetchForecastData(cityName);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast({
        title: 'Error',
        description: 'Could not find weather for that location. Please check the city name.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchForecastData = async (cityName: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&cnt=5`
      );
      
      if (!response.ok) {
        throw new Error('Error fetching forecast data');
      }
      
      const data = await response.json();
      setForecastData(data);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherData(city);
  };

  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format forecast date
  const formatForecastDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <CloudRain size={24} className="text-farmlink-primary mr-2" />
        <h2 className="text-xl font-semibold">Real-Time Weather Forecast</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            className="form-input flex-grow"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <button
            type="submit"
            className="ml-2 bg-farmlink-primary hover:bg-farmlink-secondary text-white p-2 rounded-md"
            disabled={loading}
          >
            {loading ? <Loader size={20} className="animate-spin" /> : <Search size={20} />}
          </button>
        </div>
      </form>
      
      {weatherData && (
        <div className="bg-farmlink-light rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">{weatherData.name}, {weatherData.sys.country}</h3>
              <p className="text-sm text-gray-600">Updated: {new Date(weatherData.dt * 1000).toLocaleString()}</p>
            </div>
            {weatherData.weather[0].icon && (
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
                className="w-16 h-16"
              />
            )}
          </div>
          
          <div className="mb-4">
            <div className="flex items-center">
              <Thermometer size={24} className="text-farmlink-accent mr-2" />
              <div>
                <h4 className="font-semibold text-xl">{Math.round(weatherData.main.temp)}°C</h4>
                <p className="text-sm capitalize">{weatherData.weather[0].description}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Droplets size={20} className="text-farmlink-primary mr-2" />
              <div>
                <p className="text-sm text-gray-600">Humidity</p>
                <p className="font-semibold">{weatherData.main.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center">
              <Wind size={20} className="text-farmlink-primary mr-2" />
              <div>
                <p className="text-sm text-gray-600">Wind</p>
                <p className="font-semibold">{weatherData.wind.speed} m/s</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Feels Like</p>
              <p className="font-semibold">{Math.round(weatherData.main.feels_like)}°C</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pressure</p>
              <p className="font-semibold">{weatherData.main.pressure} hPa</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Sunrise</p>
              <p className="font-semibold">{formatDate(weatherData.sys.sunrise)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Sunset</p>
              <p className="font-semibold">{formatDate(weatherData.sys.sunset)}</p>
            </div>
          </div>
        </div>
      )}
      
      {forecastData && forecastData.list && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">5-Day Forecast</h3>
          <div className="grid grid-cols-5 gap-2">
            {forecastData.list.map((item, index) => (
              <div key={index} className="bg-white rounded p-2 text-center shadow-sm">
                <p className="text-xs font-medium">{formatForecastDate(item.dt)}</p>
                <img 
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                  alt={item.weather[0].description}
                  className="w-8 h-8 mx-auto"
                />
                <p className="text-sm font-semibold">{Math.round(item.main.temp)}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!weatherData && !loading && (
        <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Enter a city name to check the weather</p>
          {userLocation && <p className="text-gray-500 text-sm mt-2">Getting weather for your current location...</p>}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
