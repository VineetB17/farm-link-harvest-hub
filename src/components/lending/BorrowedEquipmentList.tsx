
import React from 'react';
import { Equipment } from '@/types/equipment';  // Change import to types/equipment
import { Card, CardContent } from "@/components/ui/card";
import { Tag } from 'lucide-react';

interface BorrowedEquipmentListProps {
  items: Equipment[];
  onReturn: (id: string) => void;
}

const BorrowedEquipmentList: React.FC<BorrowedEquipmentListProps> = ({ items, onReturn }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">You haven't borrowed any equipment yet.</p>
        <p className="text-gray-500 mt-2">Browse the available equipment and request to borrow.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="h-40 bg-farmlink-light flex items-center justify-center">
            <Tag size={48} className="text-farmlink-accent opacity-20" />
          </div>
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <Tag size={16} className="text-farmlink-accent mr-2" />
              <span className="text-sm text-farmlink-accent">{item.category}</span>
            </div>
            <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
            <p className="text-sm text-gray-600 mb-3">Borrowed from: {item.owner}</p>
            
            <button 
              onClick={() => onReturn(item.id)}
              className="w-full py-2 rounded-md text-center bg-farmlink-primary text-white hover:bg-farmlink-primary/90 flex items-center justify-center"
            >
              <Tag size={16} className="mr-2" />
              Return Equipment
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BorrowedEquipmentList;
