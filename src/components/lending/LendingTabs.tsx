
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Equipment } from '@/types/equipment';
import EquipmentList from './EquipmentList';
import BorrowedEquipmentList from './BorrowedEquipmentList';

interface LendingTabsProps {
  equipment: Equipment[];
  loading: boolean;
  myBorrowings: Equipment[];
  requestedItems: Equipment[];
  onBorrowClick: (equipment: Equipment) => void;
  onReturnEquipment: (id: string) => void;
}

const LendingTabs: React.FC<LendingTabsProps> = ({
  equipment,
  loading,
  myBorrowings,
  requestedItems,
  onBorrowClick,
  onReturnEquipment
}) => {
  return (
    <Tabs defaultValue="available">
      <TabsList>
        <TabsTrigger value="available">Available ({equipment.filter(e => e.available).length})</TabsTrigger>
        <TabsTrigger value="borrowed">Borrowed ({myBorrowings.length})</TabsTrigger>
        <TabsTrigger value="requested">Requested ({requestedItems.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="available">
        <EquipmentList 
          items={equipment.filter(e => e.available)} 
          isLoading={loading}
          onBorrowClick={onBorrowClick}
        />
      </TabsContent>

      <TabsContent value="borrowed">
        <BorrowedEquipmentList 
          items={myBorrowings}
          onReturn={onReturnEquipment}
        />
      </TabsContent>
      
      <TabsContent value="requested">
        <EquipmentList 
          items={requestedItems}
          isLoading={false}
          emptyMessage="You haven't requested any equipment yet."
        />
      </TabsContent>
    </Tabs>
  );
};

export default LendingTabs;

