
import React, { useEffect, useState } from 'react';
import ProduceCard, { Produce } from '@/components/ProduceCard';
import { Search, Filter } from 'lucide-react';

const Marketplace: React.FC = () => {
  const [marketItems, setMarketItems] = useState<Produce[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, let's simulate loading sample data
    const loadSampleData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sampleData: Produce[] = [
        {
          id: '101',
          name: 'Organic Apples',
          quantity: 50,
          unit: 'kg',
          imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
          harvestDate: new Date('2025-04-01'),
          expiryDate: new Date('2025-04-20'),
          farmName: 'Sunny Hill Orchards',
          location: 'Eugene, OR'
        },
        {
          id: '102',
          name: 'Fresh Corn',
          quantity: 100,
          unit: 'pieces',
          imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076',
          harvestDate: new Date('2025-04-03'),
          expiryDate: new Date('2025-04-15'),
          farmName: 'Golden Fields Farm',
          location: 'Salem, OR'
        },
        {
          id: '103',
          name: 'Kale',
          quantity: 20,
          unit: 'boxes',
          imageUrl: 'https://images.unsplash.com/photo-1515472071456-47b5b388a350',
          harvestDate: new Date('2025-04-02'),
          expiryDate: new Date('2025-04-10'),
          farmName: 'River Valley Greens',
          location: 'Corvallis, OR'
        },
        {
          id: '104',
          name: 'Potatoes',
          quantity: 75,
          unit: 'kg',
          imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655',
          harvestDate: new Date('2025-03-30'),
          expiryDate: new Date('2025-04-30'),
          farmName: 'Mountain View Farm',
          location: 'Bend, OR'
        },
        {
          id: '105',
          name: 'Bell Peppers',
          quantity: 30,
          unit: 'kg',
          imageUrl: 'https://images.unsplash.com/photo-1563565375-f0d78e396063',
          harvestDate: new Date('2025-04-05'),
          expiryDate: new Date('2025-04-18'),
          farmName: 'Rainbow Gardens',
          location: 'Medford, OR'
        },
        {
          id: '106',
          name: 'Strawberries',
          quantity: 15,
          unit: 'boxes',
          imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6',
          harvestDate: new Date('2025-04-04'),
          expiryDate: new Date('2025-04-09'),
          farmName: 'Berry Best Farm',
          location: 'Portland, OR'
        },
      ];
      
      setMarketItems(sampleData);
      setLoading(false);
    };
    
    loadSampleData();
  }, []);

  const filteredItems = marketItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="farmlink-container py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-farmlink-secondary">Marketplace</h1>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10"
            placeholder="Search by produce, farm name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end mt-4">
          <button className="flex items-center text-sm text-gray-600 hover:text-farmlink-primary">
            <Filter size={16} className="mr-1" />
            Filter options
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading marketplace items...</p>
        </div>
      ) : (
        <>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <ProduceCard key={item.id} produce={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No items found matching your search criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Marketplace;
