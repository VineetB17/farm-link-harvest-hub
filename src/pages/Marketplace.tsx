import React, { useEffect, useState } from 'react';
import ProduceCard, { Produce } from '@/components/ProduceCard';
import { Search, Filter } from 'lucide-react';

const categories = [
  "All Categories",
  "Fruits",
  "Vegetables", 
  "Grains",
  "Dairy",
  "Nuts",
  "Other"
];

const Marketplace: React.FC = () => {
  const [marketItems, setMarketItems] = useState<Produce[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
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
          harvestDate: new Date('2025-04-01'),
          expiryDate: new Date('2025-04-20'),
          farmName: 'Sunny Hill Orchards',
          location: 'Northwest Region',
          category: 'Fruits'
        },
        {
          id: '102',
          name: 'Fresh Corn',
          quantity: 100,
          unit: 'pieces',
          harvestDate: new Date('2025-04-03'),
          expiryDate: new Date('2025-04-15'),
          farmName: 'Golden Fields Farm',
          location: 'Northern Region',
          category: 'Vegetables'
        },
        {
          id: '103',
          name: 'Kale',
          quantity: 20,
          unit: 'boxes',
          harvestDate: new Date('2025-04-02'),
          expiryDate: new Date('2025-04-10'),
          farmName: 'River Valley Greens',
          location: 'Southern Hills',
          category: 'Vegetables'
        },
        {
          id: '104',
          name: 'Potatoes',
          quantity: 75,
          unit: 'kg',
          harvestDate: new Date('2025-03-30'),
          expiryDate: new Date('2025-04-30'),
          farmName: 'Mountain View Farm',
          location: 'Central Plains',
          category: 'Vegetables'
        },
        {
          id: '105',
          name: 'Bell Peppers',
          quantity: 30,
          unit: 'kg',
          harvestDate: new Date('2025-04-05'),
          expiryDate: new Date('2025-04-18'),
          farmName: 'Rainbow Gardens',
          location: 'Western Valley',
          category: 'Vegetables'
        },
        {
          id: '106',
          name: 'Strawberries',
          quantity: 15,
          unit: 'boxes',
          harvestDate: new Date('2025-04-04'),
          expiryDate: new Date('2025-04-09'),
          farmName: 'Berry Best Farm',
          location: 'Highland Region',
          category: 'Fruits'
        },
        {
          id: '107',
          name: 'Organic Milk',
          quantity: 20,
          unit: 'liters',
          harvestDate: new Date('2025-04-06'),
          expiryDate: new Date('2025-04-12'),
          farmName: 'Happy Cow Dairy',
          location: 'Eastern Grasslands',
          category: 'Dairy'
        },
        {
          id: '108',
          name: 'Almonds',
          quantity: 35,
          unit: 'kg',
          harvestDate: new Date('2025-03-25'),
          expiryDate: new Date('2025-06-25'),
          farmName: 'Nutty Farm',
          location: 'Western Region',
          category: 'Nuts'
        },
        {
          id: '109',
          name: 'Basmati Rice',
          quantity: 200,
          unit: 'kg',
          harvestDate: new Date('2025-03-15'),
          expiryDate: new Date('2025-07-15'),
          farmName: 'Ganges Valley Farm',
          location: 'Northern Valley',
          category: 'Grains'
        },
        {
          id: '110',
          name: 'Mangoes',
          quantity: 60,
          unit: 'kg',
          harvestDate: new Date('2025-04-10'),
          expiryDate: new Date('2025-04-25'),
          farmName: 'Tropical Paradise',
          location: 'Coastal Region',
          category: 'Fruits'
        },
        {
          id: '111',
          name: 'Coconut',
          quantity: 80,
          unit: 'pieces',
          harvestDate: new Date('2025-04-08'),
          expiryDate: new Date('2025-05-20'),
          farmName: 'Coastal Growers',
          location: 'Coastal Plains',
          category: 'Nuts'
        },
        {
          id: '112',
          name: 'Paneer',
          quantity: 25,
          unit: 'kg',
          harvestDate: new Date('2025-04-07'),
          expiryDate: new Date('2025-04-15'),
          farmName: 'Pure Dairy',
          location: 'Northern Plains',
          category: 'Dairy'
        }
      ];
      
      setMarketItems(sampleData);
      setLoading(false);
    };
    
    loadSampleData();
  }, []);

  const filteredItems = marketItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.farmName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
            className="form-input pl-10 w-full"
            placeholder="Search by produce, farm name or location..."
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
