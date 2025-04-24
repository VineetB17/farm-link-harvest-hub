
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Equipment } from '@/types/equipment';
import AddLendingItemForm from '@/components/lending/AddLendingItemForm';
import BorrowRequestForm from '@/components/lending/BorrowRequestForm';
import CategoryFilter from '@/components/lending/CategoryFilter';
import LendingTabs from '@/components/lending/LendingTabs';
import { useEquipment } from '@/hooks/useEquipment';
import { useAuth } from '@/contexts/AuthContext';

const categories = [
  "All Categories",
  "Tractors",
  "Harvesters", 
  "Irrigation",
  "Tools",
  "Seeders",
  "Processing"
];

const Lending: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const { user } = useAuth();

  const {
    equipment,
    loading,
    myBorrowings,
    requestedItems,
    myListedItems,
    handleAddEquipment,
    handleBorrowRequest,
    handleReturnEquipment,
    handleDeleteListing
  } = useEquipment();

  const handleBorrowClick = (equipment: Equipment) => {
    // Prevent borrowing own equipment
    if (user && (equipment.owner_id === user.id || equipment.owner_name === user.name)) {
      return;
    }
    setSelectedEquipment(equipment);
    setShowBorrowForm(true);
  };

  const filteredItems = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    
    // Filter out items listed by the current user from the available tab
    const isNotOwnItem = !(user && (item.owner_id === user.id || item.owner_name === user.name));
    
    return matchesSearch && matchesCategory && isNotOwnItem;
  });

  return (
    <div className="farmlink-container py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-farmlink-secondary">Equipment Lending</h1>
      
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <div className="flex justify-end mb-6">
        <Button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center"
        >
          <PlusCircle size={18} className="mr-2" />
          List Equipment
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <AddLendingItemForm 
            onSubmit={handleAddEquipment}
            onClose={() => setShowAddForm(false)}
          />
        </div>
      )}

      {showBorrowForm && selectedEquipment && (
        <div className="mb-6">
          <BorrowRequestForm 
            equipment={selectedEquipment}
            onSubmit={(request) => {
              handleBorrowRequest(request, selectedEquipment);
              setShowBorrowForm(false);
              setSelectedEquipment(null);
            }}
            onClose={() => {
              setShowBorrowForm(false);
              setSelectedEquipment(null);
            }}
          />
        </div>
      )}

      <LendingTabs
        equipment={filteredItems}
        loading={loading}
        myBorrowings={myBorrowings}
        requestedItems={requestedItems}
        myListedItems={myListedItems}
        onBorrowClick={handleBorrowClick}
        onReturnEquipment={handleReturnEquipment}
        onDeleteListing={handleDeleteListing}
      />
    </div>
  );
};

export default Lending;
