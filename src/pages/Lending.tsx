import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, PlusCircle, Check } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import EquipmentCard, { Equipment } from '@/components/EquipmentCard';
import { nanoid } from 'nanoid';
import { Tag } from 'lucide-react';

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
  const [myBorrowings, setMyBorrowings] = useState<Equipment[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, let's simulate loading sample data
    const loadSampleData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sampleData: Equipment[] = [
        {
          id: '101',
          name: 'John Deere Tractor',
          category: 'Tractors',
          imageUrl: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13',
          owner: 'Singh Farms',
          location: 'Amritsar, Punjab',
          available: true,
          description: 'Medium-sized tractor suitable for most field operations.'
        },
        {
          id: '102',
          name: 'Irrigation System',
          category: 'Irrigation',
          imageUrl: 'https://images.unsplash.com/photo-1594394224789-9e583e6121e5',
          owner: 'Green Valley Farms',
          location: 'Coimbatore, Tamil Nadu',
          available: true,
          description: 'Complete drip irrigation system for up to 2 acres.'
        },
        {
          id: '103',
          name: 'Harvest Combine',
          category: 'Harvesters',
          imageUrl: 'https://images.unsplash.com/photo-1505672678657-cc7037095e60',
          owner: 'Kumar Agro',
          location: 'Lucknow, Uttar Pradesh',
          available: false,
          description: 'Large combine harvester suitable for grain crops.'
        },
        {
          id: '104',
          name: 'Seedling Planter',
          category: 'Seeders',
          imageUrl: 'https://images.unsplash.com/photo-1585153636167-3f5fa5123257',
          owner: 'Patel Organics',
          location: 'Ahmedabad, Gujarat',
          available: true,
          description: 'Automated seedling planter with adjustable row spacing.'
        },
        {
          id: '105',
          name: 'Apple Sorting Machine',
          category: 'Processing',
          imageUrl: 'https://images.unsplash.com/photo-1584691267914-91c0bee55964',
          owner: 'Himachal Growers',
          location: 'Shimla, Himachal Pradesh',
          available: true,
          description: 'Automated fruit sorting system for medium-sized operations.'
        },
        {
          id: '106',
          name: 'Hand Tools Bundle',
          category: 'Tools',
          imageUrl: 'https://images.unsplash.com/photo-1534190239940-9ba8944ea261',
          owner: 'Kerala Farms',
          location: 'Trivandrum, Kerala',
          available: true,
          description: 'Complete set of pruning and harvesting hand tools.'
        },
        {
          id: '107',
          name: 'Rotary Tiller',
          category: 'Tools',
          imageUrl: 'https://images.unsplash.com/photo-1590422749897-47726e632a0e',
          owner: 'Sharma Agriculture',
          location: 'Jaipur, Rajasthan',
          available: true,
          description: 'Heavy-duty tiller for preparing soil before planting.'
        },
        {
          id: '108',
          name: 'Rice Transplanter',
          category: 'Seeders',
          imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a',
          owner: 'Bengal Agro',
          location: 'Kolkata, West Bengal',
          available: true,
          description: 'Mechanical rice transplanter for efficient paddy planting.'
        },
        {
          id: '109',
          name: 'Sprinkler System',
          category: 'Irrigation',
          imageUrl: 'https://images.unsplash.com/photo-1591962738310-1fcc28db44cf',
          owner: 'Maharashtra Farms',
          location: 'Nagpur, Maharashtra',
          available: true,
          description: 'Medium-range sprinkler system for 3-4 acre coverage.'
        }
      ];
      
      setEquipment(sampleData);
      setLoading(false);
    };
    
    loadSampleData();
  }, []);

  const handleBorrowEquipment = (id: string) => {
    setEquipment(prev => prev.map(item => {
      if (item.id === id) {
        const borrowedItem = { ...item, available: false };
        setMyBorrowings(prev => [...prev, borrowedItem]);
        toast({
          title: "Equipment Borrowed",
          description: `You have successfully requested to borrow ${item.name}`,
        });
        return borrowedItem;
      }
      return item;
    }));
  };

  const handleReturnEquipment = (id: string) => {
    setMyBorrowings(prev => prev.filter(item => item.id !== id));
    setEquipment(prev => prev.map(item => {
      if (item.id === id) {
        toast({
          title: "Equipment Returned",
          description: `You have successfully returned ${item.name}`,
        });
        return { ...item, available: true };
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
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10 w-full"
            placeholder="Search by equipment name, owner or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedCategory === category 
                  ? 'bg-farmlink-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end mb-6">
        <button className="btn-primary flex items-center">
          <PlusCircle size={18} className="mr-2" />
          List Equipment
        </button>
      </div>

      <Tabs defaultValue="available">
        <TabsList>
          <TabsTrigger value="available">Available ({availableItems.length})</TabsTrigger>
          <TabsTrigger value="unavailable">Currently Borrowed ({unavailableItems.length})</TabsTrigger>
          <TabsTrigger value="myborrowing">My Borrowings ({myBorrowings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <p>Loading equipment listings...</p>
            </div>
          ) : (
            <>
              {availableItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {availableItems.map((item) => (
                    <EquipmentCard 
                      key={item.id} 
                      equipment={item} 
                      onBorrow={handleBorrowEquipment}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No equipment available matching your search criteria.</p>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="unavailable" className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <p>Loading equipment listings...</p>
            </div>
          ) : (
            <>
              {unavailableItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {unavailableItems.map((item) => (
                    <EquipmentCard key={item.id} equipment={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No borrowed equipment matching your search criteria.</p>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="myborrowing" className="mt-6">
          {myBorrowings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBorrowings.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={item.imageUrl || '/placeholder.svg'} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <Tag size={16} className="text-farmlink-accent mr-2" />
                      <span className="text-sm text-farmlink-accent">{item.category}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">Borrowed from: {item.owner}</p>
                    
                    <button 
                      onClick={() => handleReturnEquipment(item.id)}
                      className="w-full py-2 rounded-md text-center bg-farmlink-primary text-white hover:bg-farmlink-primary/90 flex items-center justify-center"
                    >
                      <Check size={16} className="mr-2" />
                      Return Equipment
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">You haven't borrowed any equipment yet.</p>
              <p className="text-gray-500 mt-2">Browse the available equipment and request to borrow.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Lending;
