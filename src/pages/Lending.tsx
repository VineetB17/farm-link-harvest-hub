
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Equipment } from '@/components/EquipmentCard';
import AddLendingItemForm from '@/components/lending/AddLendingItemForm';
import BorrowRequestForm from '@/components/lending/BorrowRequestForm';
import CategoryFilter from '@/components/lending/CategoryFilter';
import EquipmentList from '@/components/lending/EquipmentList';
import BorrowedEquipmentList from '@/components/lending/BorrowedEquipmentList';

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
  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [myBorrowings, setMyBorrowings] = useState<Equipment[]>([]);
  const [requestedItems, setRequestedItems] = useState<Equipment[]>([]);
  const { toast } = useToast();

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
          status: 'available'
        },
        {
          id: '102',
          name: 'Irrigation System',
          category: 'Irrigation',
          owner: 'Green Valley Farms',
          location: 'Coimbatore, Tamil Nadu',
          available: true,
          description: 'Complete drip irrigation system for up to 2 acres.',
          status: 'available'
        },
        {
          id: '103',
          name: 'Harvest Combine',
          category: 'Harvesters',
          owner: 'Kumar Agro',
          location: 'Lucknow, Uttar Pradesh',
          available: false,
          description: 'Large combine harvester suitable for grain crops.',
          status: 'borrowed'
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
    };
    
    loadSampleData();
  }, []);

  const handleAddEquipment = (newItem: Equipment) => {
    setEquipment(prev => [{
      ...newItem,
      status: 'available' as const,
      available: true
    }, ...prev]);
    setShowAddForm(false);
    toast({
      title: "Equipment Added",
      description: "Your equipment has been listed for lending"
    });
  };

  const handleBorrowRequest = (request: any) => {
    const updatedEquipment = equipment.map(item => {
      if (item.id === request.equipmentId) {
        return { ...item, status: 'requested' as const, available: false };
      }
      return item;
    });
    
    setEquipment(updatedEquipment);
    
    if (selectedEquipment) {
      setRequestedItems(prev => [...prev, { 
        ...selectedEquipment, 
        status: 'requested' as const 
      }]);
    }
    
    setShowBorrowForm(false);
    setSelectedEquipment(null);
    
    toast({
      title: "Request Sent",
      description: "Your borrow request has been sent"
    });
  };

  const handleBorrowClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setShowBorrowForm(true);
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

  const filteredItems = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.owner.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const availableItems = filteredItems.filter(item => item.available);
  const unavailableItems = filteredItems.filter(item => !item.available);
  
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
            onSubmit={handleBorrowRequest}
            onClose={() => {
              setShowBorrowForm(false);
              setSelectedEquipment(null);
            }}
          />
        </div>
      )}

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
            onBorrowClick={handleBorrowClick}
          />
        </TabsContent>

        <TabsContent value="borrowed">
          <BorrowedEquipmentList 
            items={myBorrowings}
            onReturn={handleReturnEquipment}
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
    </div>
  );
};

export default Lending;
