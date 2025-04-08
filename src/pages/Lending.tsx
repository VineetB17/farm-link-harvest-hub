
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, PlusCircle } from 'lucide-react';
import EquipmentCard from '@/components/EquipmentCard';

// Equipment type definition
interface Equipment {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  owner: string;
  location: string;
  available: boolean;
  description: string;
}

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
          owner: 'Green Valley Farm',
          location: 'Portland, OR',
          available: true,
          description: 'Medium-sized tractor suitable for most field operations.'
        },
        {
          id: '102',
          name: 'Irrigation System',
          category: 'Irrigation',
          imageUrl: 'https://images.unsplash.com/photo-1594394224789-9e583e6121e5',
          owner: 'River Valley Greens',
          location: 'Corvallis, OR',
          available: true,
          description: 'Complete drip irrigation system for up to 2 acres.'
        },
        {
          id: '103',
          name: 'Harvest Combine',
          category: 'Harvesters',
          imageUrl: 'https://images.unsplash.com/photo-1505672678657-cc7037095e60',
          owner: 'Mountain View Farm',
          location: 'Bend, OR',
          available: false,
          description: 'Large combine harvester suitable for grain crops.'
        },
        {
          id: '104',
          name: 'Seedling Planter',
          category: 'Seeders',
          imageUrl: 'https://images.unsplash.com/photo-1585153636167-3f5fa5123257',
          owner: 'Sunny Hill Orchards',
          location: 'Eugene, OR',
          available: true,
          description: 'Automated seedling planter with adjustable row spacing.'
        },
        {
          id: '105',
          name: 'Apple Sorting Machine',
          category: 'Processing',
          imageUrl: 'https://images.unsplash.com/photo-1584691267914-91c0bee55964',
          owner: 'Berry Best Farm',
          location: 'Salem, OR',
          available: true,
          description: 'Automated fruit sorting system for medium-sized operations.'
        },
        {
          id: '106',
          name: 'Hand Tools Bundle',
          category: 'Tools',
          imageUrl: 'https://images.unsplash.com/photo-1534190239940-9ba8944ea261',
          owner: 'Rainbow Gardens',
          location: 'Medford, OR',
          available: true,
          description: 'Complete set of pruning and harvesting hand tools.'
        },
      ];
      
      setEquipment(sampleData);
      setLoading(false);
    };
    
    loadSampleData();
  }, []);

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
                    <EquipmentCard key={item.id} equipment={item} />
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
      </Tabs>
    </div>
  );
};

export default Lending;
