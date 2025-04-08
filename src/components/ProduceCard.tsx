
import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDistance } from 'date-fns';

export interface Produce {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  imageUrl: string;
  harvestDate: Date;
  expiryDate: Date;
  farmName: string;
  location: string;
}

interface ProduceCardProps {
  produce: Produce;
}

const ProduceCard: React.FC<ProduceCardProps> = ({ produce }) => {
  const now = new Date();
  const daysLeft = formatDistance(produce.expiryDate, now, { addSuffix: true });
  const isExpiringSoon = new Date(produce.expiryDate).getTime() - now.getTime() < 3 * 24 * 60 * 60 * 1000;
  
  return (
    <div className="produce-card">
      <div className="h-48 overflow-hidden">
        <img 
          src={produce.imageUrl || '/placeholder.svg'} 
          alt={produce.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">{produce.name}</h3>
          <span className="text-farmlink-primary font-semibold">
            {produce.quantity} {produce.unit}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">From {produce.farmName}</p>
        <p className="text-sm text-gray-600 mb-3">{produce.location}</p>
        
        <div className="flex items-center text-sm">
          <Calendar size={16} className="mr-1 text-farmlink-accent" />
          <span className={isExpiringSoon ? "text-red-500" : "text-gray-600"}>
            Expiry: {daysLeft}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProduceCard;
