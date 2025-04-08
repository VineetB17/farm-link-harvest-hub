
import React from 'react';
import WeatherWidget from '@/components/WeatherWidget';

const Weather: React.FC = () => {
  return (
    <div className="farmlink-container py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Weather Forecast</h1>
      <p className="text-gray-700 mb-8">
        Check the current weather conditions for any city to help plan your farming activities.
      </p>
      
      <div className="max-w-lg mx-auto">
        <WeatherWidget />
      </div>
      
      <div className="mt-12 bg-farmlink-light p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Weather Tips for Farmers</h2>
        <ul className="space-y-3 text-gray-700">
          <li>• Monitor rainfall patterns to optimize irrigation schedules</li>
          <li>• Check frost warnings during sensitive growing seasons</li>
          <li>• Plan harvesting activities during optimal weather conditions</li>
          <li>• Protect crops from extreme weather events with advance warning</li>
          <li>• Adjust planting schedules based on seasonal forecasts</li>
        </ul>
      </div>
    </div>
  );
};

export default Weather;
