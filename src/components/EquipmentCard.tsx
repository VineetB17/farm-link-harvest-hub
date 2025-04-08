
import React from 'react';
import { MapPin, User, Tag } from 'lucide-react';

export interface Equipment {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  owner: string;
  location: string;
  available: boolean;
  description: string;
}

interface EquipmentCardProps {
  equipment: Equipment;
  onBorrow?: (id: string) => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onBorrow }) => {
  const handleBorrowClick = () => {
    if (equipment.available && onBorrow) {
      onBorrow(equipment.id);
    }
  };

  return (
    <div className="equipment-card bg-white rounded-lg shadow overflow-hidden border border-gray-100">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={equipment.imageUrl || '/placeholder.svg'} 
          alt={equipment.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            equipment.available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {equipment.available ? 'Available' : 'Borrowed'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          <Tag size={16} className="text-farmlink-accent mr-2" />
          <span className="text-sm text-farmlink-accent">{equipment.category}</span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2">{equipment.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{equipment.description}</p>
        
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm mb-1">
            <User size={14} className="mr-2 text-gray-500" />
            <span className="text-gray-700">{equipment.owner}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin size={14} className="mr-2 text-gray-500" />
            <span className="text-gray-700">{equipment.location}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <button 
            className={`w-full py-2 rounded-md text-center ${
              equipment.available 
                ? 'bg-farmlink-primary text-white hover:bg-farmlink-primary/90' 
                : 'bg-gray-100 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleBorrowClick}
            disabled={!equipment.available}
          >
            {equipment.available ? 'Request to Borrow' : 'Currently Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;
