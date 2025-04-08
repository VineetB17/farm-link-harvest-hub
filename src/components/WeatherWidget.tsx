
import React, { useState, useEffect } from 'react';
import { Search, CloudRain, Loader } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

const API_KEY = 'ad574d500e8afe03c826bee2296669ad';

const WeatherWidget: React.FC = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherData(city);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <CloudRain size={24} className="text-farmlink-primary mr-2" />
        <h2 className="text-xl font-semibold">Weather Forecast</h2>
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
        <div className="bg-farmlink-light rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{weatherData.name}</h3>
            {weatherData.weather[0].icon && (
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
                className="w-16 h-16"
              />
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Temperature</p>
              <p className="font-semibold">{Math.round(weatherData.main.temp)}°C</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Feels Like</p>
              <p className="font-semibold">{Math.round(weatherData.main.feels_like)}°C</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Weather</p>
              <p className="font-semibold capitalize">{weatherData.weather[0].description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Wind Speed</p>
              <p className="font-semibold">{weatherData.wind.speed} m/s</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="font-semibold">{weatherData.main.humidity}%</p>
            </div>
          </div>
        </div>
      )}
      
      {!weatherData && !loading && (
        <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Enter a city name to check the weather</p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
