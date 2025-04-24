import { useState, useEffect } from 'react';
import { Equipment } from '@/types/equipment';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';

export const useEquipment = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [myBorrowings, setMyBorrowings] = useState<Equipment[]>([]);
  const [requestedItems, setRequestedItems] = useState<Equipment[]>([]);
  const [myListedItems, setMyListedItems] = useState<Equipment[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadSampleData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sampleData: Equipment[] = [
        {
          id: '101',
          name: 'John Deere Tractor',
          category: 'Tractors',
          owner: 'Singh Farms',
          location: 'Amritsar, Punjab',
          available: true,
          description: 'Medium-sized tractor suitable for most field operations.',
          status: 'available',
          listedById: 'other-user-1'
        },
        {
          id: '102',
          name: 'Irrigation System',
          category: 'Irrigation',
          owner: 'Green Valley Farms',
          location: 'Coimbatore, Tamil Nadu',
          available: true,
          description: 'Complete drip irrigation system for up to 2 acres.',
          status: 'available',
          listedById: 'other-user-2'
        },
        {
          id: '103',
          name: 'Harvest Combine',
          category: 'Harvesters',
          owner: 'Kumar Agro',
          location: 'Lucknow, Uttar Pradesh',
          available: false,
          description: 'Large combine harvester suitable for grain crops.',
          status: 'borrowed',
          listedById: 'other-user-3'
        },
        {
          id: '104',
          name: 'Seedling Planter',
          category: 'Seeders',
          owner: 'Patel Organics',
          location: 'Ahmedabad, Gujarat',
          available: true,
          description: 'Automated seedling planter with adjustable row spacing.',
          status: 'available'
        },
        {
          id: '105',
          name: 'Apple Sorting Machine',
          category: 'Processing',
          owner: 'Himachal Growers',
          location: 'Shimla, Himachal Pradesh',
          available: true,
          description: 'Automated fruit sorting system for medium-sized operations.',
          status: 'available'
        },
        {
          id: '106',
          name: 'Hand Tools Bundle',
          category: 'Tools',
          owner: 'Kerala Farms',
          location: 'Trivandrum, Kerala',
          available: true,
          description: 'Complete set of pruning and harvesting hand tools.',
          status: 'available'
        },
        {
          id: '107',
          name: 'Rotary Tiller',
          category: 'Tools',
          owner: 'Sharma Agriculture',
          location: 'Jaipur, Rajasthan',
          available: true,
          description: 'Heavy-duty tiller for preparing soil before planting.',
          status: 'available'
        },
        {
          id: '108',
          name: 'Rice Transplanter',
          category: 'Seeders',
          owner: 'Bengal Agro',
          location: 'Kolkata, West Bengal',
          available: true,
          description: 'Mechanical rice transplanter for efficient paddy planting.',
          status: 'available'
        },
        {
          id: '109',
          name: 'Sprinkler System',
          category: 'Irrigation',
          owner: 'Maharashtra Farms',
          location: 'Nagpur, Maharashtra',
          available: true,
          description: 'Medium-range sprinkler system for 3-4 acre coverage.',
          status: 'available'
        }
      ];
      
      setEquipment(sampleData);
      setLoading(false);
      
      if (user) {
        setMyListedItems(sampleData.filter(item => 
          item.listedById === user.id || item.owner === user.name
        ));
      }
    };
    
    loadSampleData();
  }, [user]);

  const handleAddEquipment = (newItem: Equipment) => {
    if (!user) return;
    
    const listedItem = {
      ...newItem,
      status: 'available' as const,
      available: true,
      listedById: user.id,
      owner: user.name || user.email.split('@')[0]
    };
    
    setEquipment(prev => [listedItem, ...prev]);
    setMyListedItems(prev => [listedItem, ...prev]);
    
    toast({
      title: "Equipment Added",
      description: "Your equipment has been listed for lending"
    });
  };

  const handleBorrowRequest = (request: any, selectedEquipment: Equipment | null) => {
    if (!selectedEquipment || !user) return;
    
    if (selectedEquipment.listedById === user.id || selectedEquipment.owner === user.name) {
      toast({
        title: "Cannot Borrow Own Equipment",
        description: "You cannot borrow equipment that you've listed",
        variant: "destructive"
      });
      return;
    }
    
    const updatedEquipment = equipment.map(item => {
      if (item.id === request.equipmentId) {
        return { ...item, status: 'requested' as const, available: false };
      }
      return item;
    });
    
    setEquipment(updatedEquipment);
    
    setRequestedItems(prev => [...prev, { 
      ...selectedEquipment, 
      status: 'requested' as const,
      available: false 
    }]);
    
    toast({
      title: "Request Sent",
      description: "Your borrow request has been sent"
    });
  };

  const handleReturnEquipment = (id: string) => {
    setMyBorrowings(prev => prev.filter(item => item.id !== id));
    setEquipment(prev => prev.map(item => {
      if (item.id === id) {
        toast({
          title: "Equipment Returned",
          description: `You have successfully returned ${item.name}`,
        });
        return { ...item, available: true, status: 'available' as const };
      }
      return item;
    }));
  };
  
  const handleDeleteListing = (id: string) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
    setMyListedItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Listing Removed",
      description: "Your equipment listing has been removed",
    });
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
