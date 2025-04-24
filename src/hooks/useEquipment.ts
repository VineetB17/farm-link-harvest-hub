
import { useState, useEffect } from 'react';
import { Equipment } from '@/types/equipment';
import { useAuth } from '@/contexts/AuthContext';
import { useEquipmentActions } from './useEquipmentActions';
import { sampleEquipmentData } from '@/data/sampleEquipment';

export const useEquipment = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [myBorrowings, setMyBorrowings] = useState<Equipment[]>([]);
  const [requestedItems, setRequestedItems] = useState<Equipment[]>([]);
  const [myListedItems, setMyListedItems] = useState<Equipment[]>([]);
  const { user } = useAuth();
  const equipmentActions = useEquipmentActions();
  
  useEffect(() => {
    const loadSampleData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEquipment(sampleEquipmentData);
      setLoading(false);
      
      if (user) {
        setMyListedItems(sampleEquipmentData.filter(item => 
          item.listedById === user.id || item.owner === user.name
        ));
      }
    };
    
    loadSampleData();
  }, [user]);

  const handleAddEquipment = (newItem: Equipment) => {
    if (!user) return;
    
    const listedItem = equipmentActions.handleAddEquipment(newItem, user.id, user.name || user.email.split('@')[0]);
    setEquipment(prev => [listedItem, ...prev]);
    setMyListedItems(prev => [listedItem, ...prev]);
  };

  const handleBorrowRequest = (request: any, selectedEquipment: Equipment | null) => {
    if (!selectedEquipment || !user) return;
    
    if (selectedEquipment.listedById === user.id || selectedEquipment.owner === user.name) {
      return;
    }
    
    equipmentActions.handleBorrowRequest(selectedEquipment.id);
    
    const updatedEquipment = equipment.map(item => {
      if (item.id === request.equipmentId) {
        return { ...item, status: 'requested' as const, available: false };
      }
      return item;
    });
    
    setEquipment(updatedEquipment);
    setRequestedItems(prev => [...prev, { ...selectedEquipment, status: 'requested', available: false }]);
  };

  const handleReturnEquipment = (id: string) => {
    setMyBorrowings(prev => prev.filter(item => item.id !== id));
    setEquipment(prev => prev.map(item => {
      if (item.id === id) {
        equipmentActions.handleReturnEquipment(id, item.name);
        return { ...item, available: true, status: 'available' as const };
      }
      return item;
    }));
  };
  
  const handleDeleteListing = (id: string) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
    setMyListedItems(prev => prev.filter(item => item.id !== id));
    equipmentActions.handleDeleteListing();
  };

  return {
    equipment,
    loading,
    myBorrowings,
    requestedItems,
    myListedItems,
    handleAddEquipment,
    handleBorrowRequest,
    handleReturnEquipment,
    handleDeleteListing
  };
};
