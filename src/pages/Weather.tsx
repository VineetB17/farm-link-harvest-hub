
import React from 'react';
import WeatherWidget from '@/components/WeatherWidget';
import { Card, CardContent } from "@/components/ui/card";
import { CloudRain, Umbrella, CloudLightning, CloudSnow } from 'lucide-react';

const Weather: React.FC = () => {
  return (
    <div className="farmlink-container py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Weather Forecast</h1>
      <p className="text-gray-700 mb-8">
        Get real-time weather updates to help plan your farming activities effectively across India.
      </p>
      
      <div className="max-w-3xl mx-auto">
        <WeatherWidget />
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-farmlink-light shadow-md">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CloudRain className="mr-2 text-farmlink-primary" size={24} />
              Weather Tips for Farmers
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li>• Monitor rainfall patterns to optimize irrigation schedules</li>
              <li>• Check frost warnings during sensitive growing seasons</li>
              <li>• Plan harvesting activities during optimal weather conditions</li>
              <li>• Protect crops from extreme weather events with advance warning</li>
              <li>• Adjust planting schedules based on seasonal forecasts</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-farmlink-light shadow-md">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CloudLightning className="mr-2 text-farmlink-primary" size={24} />
              Seasonal Farming Calendar
            </h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Monsoon Season (June-September)</p>
                <p className="text-sm text-gray-600">Rice, millets, pulses planting ideal during these months</p>
              </div>
              <div>
                <p className="font-medium">Winter Season (November-February)</p>
                <p className="text-sm text-gray-600">Wheat, potato, mustard cultivation recommended</p>
              </div>
              <div>
                <p className="font-medium">Summer Season (March-June)</p>
                <p className="text-sm text-gray-600">Heat-resistant vegetables, melons, gourds are suitable</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card className="bg-white shadow-md">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Umbrella className="mr-2 text-farmlink-primary" size={24} />
              Weather Alerts for Indian Farmers
            </h2>
            <p className="mb-4">Stay updated with regional weather alerts from the Indian Meteorological Department:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• Subscribe to SMS alerts from local agricultural extension services</li>
              <li>• Install the Kisan Suvidha app for weather updates specific to your region</li>
              <li>• Check the FarmLink app daily for localized weather reports</li>
              <li>• Connect with regional weather stations for more accurate predictions</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Weather;
