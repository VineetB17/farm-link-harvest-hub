
import React from 'react';
import { Calendar, Tag } from 'lucide-react';
import { formatDistance } from 'date-fns';

export interface Produce {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  harvestDate: Date;
  expiryDate: Date;
  farmName: string;
  location: string;
  category?: string;
  image_url?: string;
  price?: number; // Added price property
}

interface ProduceCardProps {
  produce: Produce;
}

const ProduceCard: React.FC<ProduceCardProps> = ({ produce }) => {
  const now = new Date();
  const daysLeft = formatDistance(produce.expiryDate, now, { addSuffix: true });
  const isExpiringSoon = new Date(produce.expiryDate).getTime() - now.getTime() < 3 * 24 * 60 * 60 * 1000;
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all">
      {produce.image_url && (
        <div className="aspect-video mb-3 rounded-md overflow-hidden">
          <img 
            src={produce.image_url} 
            alt={produce.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-farmlink-secondary">{produce.name}</h3>
          <p className="text-sm text-gray-600">{produce.farmName}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-farmlink-primary font-semibold bg-farmlink-light px-3 py-1 rounded-full">
            {produce.quantity} {produce.unit}
          </span>
          {produce.price !== undefined && (
            <span className="text-green-600 font-bold mt-1">
              ₹{produce.price.toFixed(2)}/{produce.unit}
            </span>
          )}
        </div>
      </div>

      {produce.category && (
        <div className="flex items-center mb-3">
          <Tag size={16} className="text-farmlink-accent mr-2" />
          <span className="text-sm text-farmlink-accent">{produce.category}</span>
        </div>
      )}
      
      <p className="text-sm text-gray-600 mb-3">{produce.location}</p>
      
      <div className="flex items-center text-sm mt-auto pt-2 border-t border-gray-100">
        <Calendar size={16} className="mr-1 text-farmlink-accent" />
        <span className={isExpiringSoon ? "text-red-500" : "text-gray-600"}>
          Expiry: {daysLeft}
        </span>
      </div>
    </div>
  );
};

export default ProduceCard;
