
import React from 'react';
import { Equipment } from '@/components/EquipmentCard';
import EquipmentCard from '@/components/EquipmentCard';

interface EquipmentListProps {
  items: Equipment[];
  isLoading?: boolean;
  onBorrowClick?: (equipment: Equipment) => void;
  emptyMessage?: string;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ 
  items, 
  isLoading, 
  onBorrowClick,
  emptyMessage = "No equipment available matching your search criteria."
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p>Loading equipment listings...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {items.map((item) => (
        <EquipmentCard 
          key={item.id} 
          equipment={item}
          onBorrow={onBorrowClick ? () => onBorrowClick(item) : undefined}
        />
      ))}
    </div>
  );
};

export default EquipmentList;
